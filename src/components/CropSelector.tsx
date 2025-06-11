
import React, { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CropSelectorProps {
  selectedImage: string | null;
  onCropSelected: (crop: string) => void;
  onBack: () => void;
}

const CropSelector: React.FC<CropSelectorProps> = ({ selectedImage, onCropSelected, onBack }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const crops = [
    { id: 'alface', name: 'Alface', icon: '🥬', description: 'Folhas verdes' },
    { id: 'mandioca', name: 'Mandioca', icon: '🍠', description: 'Raiz tuberosa' },
    { id: 'tomate', name: 'Tomate', icon: '🍅', description: 'Fruto vermelho' },
    { id: 'cenoura', name: 'Cenoura', icon: '🥕', description: 'Raiz alaranjada' },
    { id: 'milho', name: 'Milho', icon: '🌽', description: 'Grão amarelo' }
  ];

  const handleAnalyze = () => {
    if (selectedCrop) {
      setIsAnalyzing(true);
      onCropSelected(selectedCrop);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Selecione a Cultura</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Imagem Selecionada</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Planta selecionada"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </CardContent>
        </Card>

        {/* Crop Selection */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Qual cultura você está analisando?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCrop === crop.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setSelectedCrop(crop.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{crop.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{crop.name}</h3>
                    <p className="text-sm text-gray-500">{crop.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={handleAnalyze}
              disabled={!selectedCrop || isAnalyzing}
              className="w-full mt-6 bg-green-500 hover:bg-green-600"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                'Iniciar Diagnóstico'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropSelector;
