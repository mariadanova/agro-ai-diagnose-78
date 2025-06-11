
import React from 'react';
import { Loader2, Brain, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CropIdentificationLoadingProps {
  selectedImage: string | null;
  progress: number;
}

const CropIdentificationLoading: React.FC<CropIdentificationLoadingProps> = ({ 
  selectedImage, 
  progress 
}) => {
  const getProgressMessage = () => {
    if (progress < 25) return 'Carregando modelo de IA...';
    if (progress < 50) return 'Analisando imagem...';
    if (progress < 75) return 'Identificando cultura...';
    return 'Finalizando identificação...';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-gray-900">Identificando Cultura</h2>
        <Brain className="h-6 w-6 text-green-500 animate-pulse" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Imagem sendo Analisada</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Planta sendo analisada"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <span>Análise por IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Processando...
              </p>
              <p className="text-sm text-gray-600">
                {getProgressMessage()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">🤖 IA em ação</h4>
              <p className="text-sm text-blue-800">
                Nossa inteligência artificial está analisando sua imagem para 
                identificar automaticamente o tipo de hortaliça.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropIdentificationLoading;
