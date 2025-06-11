
import React from 'react';
import { Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CropSelectorProps {
  selectedImage: string | null;
  selectedCrop: string;
  onCropChange: (crop: string) => void;
  onProceed: () => void;
}

const crops = [
  { id: 'alface', name: 'Alface' },
  { id: 'mandioca', name: 'Mandioca' },
  { id: 'tomate', name: 'Tomate' },
  { id: 'cenoura', name: 'Cenoura' },
  { id: 'milho', name: 'Milho' }
];

const CropSelector: React.FC<CropSelectorProps> = ({ 
  selectedImage, 
  selectedCrop, 
  onCropChange, 
  onProceed 
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-gray-900">Selecionar Cultura</h2>
        <Leaf className="h-6 w-6 text-green-500" />
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
                alt="Planta a ser analisada"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </CardContent>
        </Card>

        {/* Crop Selection */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <span>Tipo de Cultura</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o tipo de hortaliça:
              </label>
              <Select value={selectedCrop} onValueChange={onCropChange}>
                <SelectTrigger id="crop-select">
                  <SelectValue placeholder="Escolha uma cultura" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Dica</h4>
              <p className="text-sm text-blue-800">
                Selecione corretamente o tipo de hortaliça para obter 
                um diagnóstico mais preciso e recomendações específicas.
              </p>
            </div>

            <Button 
              onClick={onProceed} 
              disabled={!selectedCrop}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Continuar para Diagnóstico
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropSelector;
