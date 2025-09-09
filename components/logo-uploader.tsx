'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface LogoUploaderProps {
  onLogoChange?: (logoUrl: string | null) => void;
  showUploadInterface?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  onLogoChange,
  showUploadInterface = false,
  size = 'sm'
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load saved logo from localStorage
    const savedLogo = localStorage.getItem('arogya-logo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoUrl(result);
      localStorage.setItem('arogya-logo', result);
      onLogoChange?.(result);
      setIsUploading(false);
      
      // Generate favicon
      generateFavicon(result);
    };
    reader.readAsDataURL(file);
  };

  const generateFavicon = (imageUrl: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      // Generate different sizes for favicon
      const sizes = [16, 32, 48];
      
      sizes.forEach(size => {
        canvas.width = size;
        canvas.height = size;
        ctx?.clearRect(0, 0, size, size);
        ctx?.drawImage(img, 0, 0, size, size);
        
        const faviconUrl = canvas.toDataURL('image/png');
        
        // Update or create favicon link
        let favicon = document.querySelector(`link[rel="icon"][sizes="${size}x${size}"]`) as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          favicon.sizes = `${size}x${size}`;
          favicon.type = 'image/png';
          document.head.appendChild(favicon);
        }
        favicon.href = faviconUrl;
      });
    };
    
    img.src = imageUrl;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
    localStorage.removeItem('arogya-logo');
    onLogoChange?.(null);
    
    // Reset to default favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = '/favicon.ico';
    }
  };

  // Simple logo display for navbar
  if (!showUploadInterface) {
    return (
      <div className={`${getSizeClasses()} rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden`}>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Arogya AI Logo"
            className="w-full h-full object-cover"
            width={32}
            height={32}
          />
        ) : (
          <div className="text-white font-bold text-xs">
            A
          </div>
        )}
      </div>
    );
  }

  // Full upload interface
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Logo Upload</h3>
        {logoUrl && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showPreview ? 'Hide' : 'Show'} Favicon Preview
          </button>
        )}
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
          </div>
        ) : logoUrl ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <Image
                src={logoUrl}
                alt="Uploaded logo"
                className="w-24 h-24 object-cover rounded-lg shadow-md"
                width={96}
                height={96}
              />
              <button
                onClick={removeLogo}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600">Click to change logo</p>
          </div>
        ) : (
          <div className="py-4">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                Click to upload
              </span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={handleInputChange}
        />
      </div>

      {/* Favicon Preview */}
      <AnimatePresence>
        {showPreview && logoUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h4 className="text-sm font-medium text-gray-900 mb-3">Favicon Preview</h4>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-600">16x16:</div>
              <div className="w-4 h-4 bg-white border border-gray-200 rounded overflow-hidden">
                <Image
                  src={logoUrl}
                  alt="16x16 favicon"
                  className="w-full h-full object-cover"
                  width={16}
                  height={16}
                />
              </div>
              <div className="text-xs text-gray-600">32x32:</div>
              <div className="w-8 h-8 bg-white border border-gray-200 rounded overflow-hidden">
                <Image
                  src={logoUrl}
                  alt="32x32 favicon"
                  className="w-full h-full object-cover"
                  width={32}
                  height={32}
                />
              </div>
              <div className="text-xs text-gray-600">48x48:</div>
              <div className="w-12 h-12 bg-white border border-gray-200 rounded overflow-hidden">
                <Image
                  src={logoUrl}
                  alt="48x48 favicon"
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogoUploader;