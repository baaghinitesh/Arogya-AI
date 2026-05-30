// Mock MongoDB file - Frontend uses SQLite on the backend server instead of direct MongoDB.
export async function connectToDatabase() {
  console.log('MongoDB client disabled: Using FastAPI backend SQLite.');
  return { client: null, db: null } as any;
}

export async function disconnectFromDatabase() {
  return Promise.resolve();
}

export const db = null as any;