
import React, { useState } from 'react';
import { Camera, Upload, FileText, History, Leaf, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUpload from '@/components/ImageUpload';
import CropSelector from '@/components/CropSelector';
import DiagnosisResult from '@/components/DiagnosisResult';
import DiagnosisHistory from '@/components/DiagnosisHistory';
import WeatherIrrigation from './WeatherIrrigation';

const Index = () => {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, selecting, diagnosis, history, weather
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [diagnosisData, setDiagnosisData] = useState(null);

  const handleImageSelected = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setCurrentStep('selecting');
  };

  const handleCropSelected = () => {
    // Simular chamada para API de diagnóstico
    setTimeout(() => {
      const mockDiagnosis = {
        plantName: getCropName(selectedCrop),
        disease: getRandomDisease(selectedCrop),
        severity: Math.floor(Math.random() * 100),
        confidence: 85 + Math.floor(Math.random() * 15),
        recommendations: getRecommendations(selectedCrop),
        image: selectedImage
      };
      setDiagnosisData(mockDiagnosis);
      setCurrentStep('diagnosis');
    }, 1500);
  };

  const getCropName = (cropId: string) => {
    const names = {
      alface: 'Alface',
      mandioca: 'Mandioca',
      tomate: 'Tomate',
      cenoura: 'Cenoura',
      milho: 'Milho'
    };
    return names[cropId as keyof typeof names] || 'Cultura';
  };

  const getRandomDisease = (crop: string) => {
    const diseases = {
      alface: ['Míldio', 'Queima das pontas', 'Podridão mole'],
      mandioca: ['Bacteriose', 'Superalongamento', 'Ácaros'],
      tomate: ['Pinta-preta', 'Requeima', 'Oídio'],
      cenoura: ['Queima das folhas', 'Alternária', 'Podridão'],
      milho: ['Ferrugem', 'Mancha foliar', 'Enfezamento']
    };
    const cropDiseases = diseases[crop as keyof typeof diseases] || ['Doença não identificada'];
    return cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
  };

  const getRecommendations = (crop: string) => {
    return [
      'Remover plantas infectadas imediatamente',
      'Aplicar fungicida específico conforme orientação técnica',
      'Melhorar ventilação entre as plantas',
      'Evitar irrigação nas folhas',
      'Monitorar clima e umidade'
    ];
  };

  const resetFlow = () => {
    setCurrentStep('upload');
    setSelectedImage(null);
    setSelectedCrop('');
    setDiagnosisData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">agro.IA</h1>
                <p className="text-sm text-gray-600">Diagnóstico Inteligente de Hortaliças</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('weather')}
                className="flex items-center space-x-2"
              >
                <Cloud className="h-4 w-4" />
                <span>Clima</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentStep('history')}
                className="flex items-center space-x-2"
              >
                <History className="h-4 w-4" />
                <span>Histórico</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Diagnosticar Planta</CardTitle>
                <p className="text-green-100">
                  Tire uma foto da sua hortaliça para análise
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <ImageUpload onImageSelected={handleImageSelected} />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'selecting' && (
          <CropSelector
            selectedImage={selectedImage}
            selectedCrop={selectedCrop}
            onCropChange={setSelectedCrop}
            onProceed={handleCropSelected}
          />
        )}

        {currentStep === 'diagnosis' && diagnosisData && (
          <div className="max-w-4xl mx-auto">
            <DiagnosisResult
              diagnosis={diagnosisData}
              onNewDiagnosis={resetFlow}
            />
          </div>
        )}

        {currentStep === 'history' && (
          <div className="max-w-6xl mx-auto">
            <DiagnosisHistory onBack={() => setCurrentStep('upload')} />
          </div>
        )}

        {currentStep === 'weather' && (
          <div className="max-w-6xl mx-auto">
            <WeatherIrrigation onBack={() => setCurrentStep('upload')} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2025 agro.IA - Tecnologia a serviço da agricultura
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Suporte à tomada de decisão para pequenos e médios produtores
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
