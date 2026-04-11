import { UploadCloud, File, X, Image as ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";

const FileUploadZone = ({ files, setFiles, maxFiles = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [files]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    setFiles(prev => {
      const combined = [...prev, ...validFiles];
      return combined.slice(0, maxFiles);
    });
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ease-in-out cursor-pointer ${
          isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        } ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={files.length >= maxFiles ? undefined : handleDrop}
        onClick={() => files.length < maxFiles && document.getElementById('file-upload').click()}
      >
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept="image/*,.pdf"
          className="hidden" 
          onChange={handleFileInput}
          disabled={files.length >= maxFiles}
        />
        <UploadCloud className={`mx-auto h-12 w-12 mb-3 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`} />
        <p className="text-sm font-medium text-gray-700">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Images and PDF only (max {maxFiles} files)
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files.map((file, idx) => {
            const isImage = file.type.startsWith('image/');
            const previewUrl = isImage ? URL.createObjectURL(file) : null;
            
            return (
              <li key={idx} className="flex items-center p-3 rounded-lg border border-gray-200 bg-white shadow-sm relative pr-10">
                <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center mr-3 border border-gray-100">
                  {isImage && previewUrl ? (
                    <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                  ) : isImage ? (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <File className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="truncate flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploadZone;
