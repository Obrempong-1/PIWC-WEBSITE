import { X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

const ImageModal = ({ isOpen, onClose, imageUrl, altText }: ImageModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt={altText} className="w-full h-auto max-h-[90vh] object-contain rounded-lg" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;