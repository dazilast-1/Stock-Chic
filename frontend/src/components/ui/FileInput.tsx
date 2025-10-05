import React, { forwardRef, useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface FileInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileList | null) => void;
  className?: string;
  preview?: string | null;
  onRemovePreview?: () => void;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    accept = "image/*", 
    multiple = false, 
    onChange, 
    className,
    preview,
    onRemovePreview,
    ...props 
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const displayRef = ref || fileInputRef;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.files);
      }
    };

    const handleClick = () => {
      if (displayRef && 'current' in displayRef && displayRef.current) {
        displayRef.current.click();
      }
    };

    const handleRemovePreview = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onRemovePreview) {
        onRemovePreview();
      }
    };

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="space-y-2">
          {/* Aperçu de l'image */}
          {preview && (
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={preview}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
              </div>
              {onRemovePreview && (
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Zone de drop et bouton de sélection */}
          <div
            onClick={handleClick}
            className={clsx(
              "cursor-pointer inline-flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-all duration-200",
              "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800",
              "hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500",
              "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
              error && "border-red-500 dark:border-red-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "w-full min-h-[80px] flex-col space-y-2"
            )}
          >
            {preview ? (
              <>
                <Image className="w-6 h-6" />
                <span>Changer l'image</span>
                <span className="text-xs text-gray-500">Cliquez ou glissez une nouvelle image</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span>Choisir un fichier depuis votre PC</span>
                <span className="text-xs text-gray-500">Cliquez ou glissez une image ici</span>
              </>
            )}
          </div>

          {/* Input file caché */}
          <input
            ref={displayRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export default FileInput;
