
import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelected(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          dragActive 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-green-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Arraste e solte sua imagem aqui
          </h3>
          <p className="text-gray-500 mb-6">
            ou clique no botão abaixo para selecionar
          </p>
          <Button
            onClick={() => galleryInputRef.current?.click()}
            className="bg-green-500 hover:bg-green-600"
          >
            <Upload className="mr-2 h-4 w-4" />
            Selecionar Imagem
          </Button>
        </div>
      </Card>

      {/* Camera Button */}
      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          className="w-full border-green-500 text-green-600 hover:bg-green-50"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="mr-2 h-5 w-5" />
          Usar Câmera
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Dicas para uma boa foto:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use boa iluminação natural</li>
          <li>• Foque nas folhas afetadas</li>
          <li>• Mantenha a câmera estável</li>
          <li>• Evite sombras na planta</li>
        </ul>
      </div>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        capture="environment"
      />
    </div>
  );
};

export default ImageUpload;
