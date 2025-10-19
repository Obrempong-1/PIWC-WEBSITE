import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, CheckCircle, Loader } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  uploading: boolean;
  uploaded: boolean;
  label: string;
  accept?: string;
  multiple?: boolean;
}

export const FileUpload = ({ onFileSelect, uploading, uploaded, label, accept, multiple = false }: FileUploadProps) => {
  const [fileInfo, setFileInfo] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (multiple) {
        setFileInfo(`${acceptedFiles.length} file(s) selected`);
        onFileSelect(acceptedFiles);
      } else {
        const file = acceptedFiles[0];
        setFileInfo(file.name);
        onFileSelect([file]);
      }
    }
  }, [onFileSelect, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple
  });

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div
        {...getRootProps()}
        className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}>
        <div className="space-y-1 text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
                <Loader className="mx-auto h-12 w-12 text-primary animate-spin" />
                <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            </div>
          ) : uploaded ? (
            <div className="flex flex-col items-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="text-sm text-gray-500 mt-2">Upload Complete!</p>
                {fileInfo && <p className="text-xs text-gray-500">{fileInfo}</p>}
            </div>
          ) : (
            <>
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <span className="relative rounded-md font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                  <span>Upload a file</span>
                  <input {...getInputProps()} className="sr-only" />
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">{accept ? `${accept.replace('/*', '')} files` : 'Any file type'}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
