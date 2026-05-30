import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, StepList, DocNavigation, Breadcrumb,
} from '@/components/docs/doc-components';

export default function DeploymentPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'Deployment' }]} />
      <DocPageHeader
        badge="Deployment"
        title="Deployment Guide"
        description="Deploy Arogya AI to production on AWS EC2 using Docker Compose, Nginx reverse proxy, and Let's Encrypt SSL certificates."
      />

      <DocSection title="Production Stack">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { icon: '🐳', label: 'Docker Compose', desc: 'Orchestrates all services' },
            { icon: '🌐', label: 'Nginx', desc: 'Reverse proxy + SSL' },
            { icon: '🔒', label: "Let's Encrypt", desc: 'Free SSL certificates' },
            { icon: '☁️', label: 'AWS EC2', desc: 'Ubuntu 22.04 LTS' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <CodeBlock title="docker-compose.yml — Services" language="yaml" code={`services:
  redis:
    image: redis:7-alpine
    container_name: health_redis
    restart: always
    volumes:
      - data_redis:/data
    networks: [healthnet]

  backend:
    build: { context: ./backend }
    container_name: health_backend
    restart: always
    env_file: [.env]
    ports: ['8000:8000']
    depends_on: [redis]
    volumes:
      - ./data/sqlite:/app/storage
      - ./data/vector_db:/app/rag/vector_store
      - ./data/logs:/app/logs
    networks: [healthnet]

  nginx:
    image: nginx:stable-alpine
    container_name: health_nginx
    restart: always
    ports: ['80:80', '443:443']
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/letsencrypt:/etc/letsencrypt
      - ./nginx/html:/var/www/certbot
    depends_on: [backend]
    networks: [healthnet]

  certbot:
    image: certbot/certbot
    volumes:
      - ./nginx/letsencrypt:/etc/letsencrypt
      - ./nginx/html:/var/www/certbot
    networks: [healthnet]`} />
      </DocSection>

      <DocSection title="EC2 Bootstrap">
        <StepList steps={[
          {
            title: 'Launch EC2 instance',
            description: 'Ubuntu 22.04 LTS, t3.medium or larger. Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS) in the security group.',
          },
          {
            title: 'Run the bootstrap script',
            description: 'The scripts/ec2_bootstrap.sh installs Docker, Docker Compose, Git, and all system dependencies.',
          },
          {
            title: 'Clone the repository',
            description: 'Clone ArogyaAI-server to /opt/arogyaai on the EC2 instance.',
          },
          {
            title: 'Configure environment',
            description: 'Copy .env.example to .env and fill in all required values.',
          },
          {
            title: 'Obtain SSL certificate',
            description: 'Run scripts/obtain_certs.sh to get a Let\'s Encrypt certificate for arogyaai.duckdns.org.',
          },
          {
            title: 'Start all services',
            description: 'docker compose up -d starts Redis, backend, and Nginx in detached mode.',
          },
        ]} />

        <CodeBlock title="scripts/ec2_bootstrap.sh" language="bash" code={`#!/bin/bash
# Run as root on fresh Ubuntu 22.04

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker ubuntu

# Install Docker Compose v2
apt-get install -y docker-compose-plugin

# Install utilities
apt-get install -y git curl wget unzip

# Install ffmpeg (for voice transcription)
apt-get install -y ffmpeg

echo "✅ EC2 bootstrap complete. Reboot recommended."
reboot`} />
      </DocSection>

      <DocSection title="SSL Certificate Setup">
        <InfoCard type="warning" title="Domain Required">
          SSL requires a domain name pointing to your EC2 IP. The project uses
          <code className="font-mono text-xs bg-amber-100 px-1 rounded mx-1">arogyaai.duckdns.org</code> (free DuckDNS subdomain).
          Update <code className="font-mono text-xs bg-amber-100 px-1 rounded">nginx/nginx.conf</code> with your domain.
        </InfoCard>

        <CodeBlock title="scripts/obtain_certs.sh" language="bash" code={`#!/bin/bash
# Run from the ArogyaAI-server directory

DOMAIN="arogyaai.duckdns.org"
EMAIL="admin@arogyaai.com"

# Start Nginx first (HTTP only, for ACME challenge)
docker compose up -d nginx

# Obtain certificate
docker compose run --rm certbot certonly \\
  --webroot \\
  --webroot-path=/var/www/certbot \\
  --email $EMAIL \\
  --agree-tos \\
  --no-eff-email \\
  -d $DOMAIN

echo "✅ Certificate obtained. Update nginx.conf to enable HTTPS."
docker compose restart nginx`} />

        <DocSubSection title="Nginx HTTPS Configuration">
          <CodeBlock title="nginx/nginx.conf (with SSL)" language="nginx" code={`server {
    listen 80;
    server_name arogyaai.duckdns.org;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name arogyaai.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/arogyaai.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/arogyaai.duckdns.org/privkey.pem;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        proxy_connect_timeout 10s;
    }
}`} />
        </DocSubSection>
      </DocSection>

      <DocSection title="Dockerfile">
        <CodeBlock title="backend/Dockerfile" language="dockerfile" code={`FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (ffmpeg for voice)
RUN apt-get update && apt-get install -y \\
    ffmpeg \\
    libsndfile1 \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directories
RUN mkdir -p data rag/vector_store logs

# Expose port
EXPOSE 8000

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]`} />

        <CodeBlock title="backend/entrypoint.sh" language="bash" code={`#!/bin/bash
set -e

# Wait for Redis to be ready
echo "Waiting for Redis..."
until redis-cli -u $REDIS_URL ping 2>/dev/null; do
  sleep 1
done
echo "Redis is ready."

# Start the FastAPI server with Gunicorn
exec gunicorn api.main:app \\
  --worker-class uvicorn.workers.UvicornWorker \\
  --workers 2 \\
  --bind 0.0.0.0:8000 \\
  --timeout 120 \\
  --access-logfile - \\
  --error-logfile -`} />
      </DocSection>

      <DocSection title="Monitoring & Logs">
        <CodeBlock title="Useful Docker commands" language="bash" code={`# View all running containers
docker compose ps

# Stream backend logs
docker compose logs -f backend

# Stream all service logs
docker compose logs -f

# Check backend health
curl https://arogyaai.duckdns.org/
# → {"message": "Rural Health Assistant API Running"}

# Restart a specific service
docker compose restart backend

# Rebuild after code changes
docker compose up --build -d backend

# View Redis memory usage
docker compose exec redis redis-cli info memory

# Access SQLite database
docker compose exec backend sqlite3 data/health_db.sqlite ".tables"`} />
      </DocSection>

      <DocSection title="Certificate Renewal">
        <p className="text-gray-600 text-sm mb-4">
          Let's Encrypt certificates expire every 90 days. Set up a cron job for automatic renewal.
        </p>
        <CodeBlock title="crontab -e" language="bash" code={`# Renew SSL certificate every 60 days at 3 AM
0 3 */60 * * cd /opt/arogyaai && docker compose run --rm certbot renew && docker compose restart nginx`} />
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs/auth', label: 'Authentication' }}
        next={{ href: '/docs/configuration', label: 'Configuration' }}
      />
    </div>
  );
}
