
import React from 'react';
import { FileText, Download, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DiagnosisData {
  plantName: string;
  disease: string;
  severity: number;
  confidence: number;
  recommendations: string[];
  image: string;
}

interface DiagnosisResultProps {
  diagnosis: DiagnosisData;
  onNewDiagnosis: () => void;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ diagnosis, onNewDiagnosis }) => {
  const getSeverityColor = (severity: number) => {
    if (severity < 30) return 'text-green-600';
    if (severity < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity < 30) return 'Leve';
    if (severity < 70) return 'Moderada';
    return 'Severa';
  };

  const generatePDF = () => {
    // Simular geração de PDF
    const blob = new Blob(['Laudo Técnico - agro.IA'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laudo-${diagnosis.plantName}-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Salvar no localStorage para histórico
  React.useEffect(() => {
    const historyKey = 'agroia-history';
    const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...diagnosis
    };
    const updated = [newEntry, ...existing].slice(0, 20); // Manter apenas 20 registros
    localStorage.setItem(historyKey, JSON.stringify(updated));
  }, [diagnosis]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Resultado do Diagnóstico</h2>
        <Button onClick={onNewDiagnosis} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Nova Análise
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image and Basic Info */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Imagem Analisada</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {diagnosis.plantName}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={diagnosis.image}
              alt="Planta analisada"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Confiança do Diagnóstico:</span>
                <span className="text-lg font-bold text-green-600">{diagnosis.confidence}%</span>
              </div>
              <Progress value={diagnosis.confidence} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Details */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Diagnóstico Detectado</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{diagnosis.disease}</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Severidade:</span>
                <span className={`font-bold ${getSeverityColor(diagnosis.severity)}`}>
                  {getSeverityLabel(diagnosis.severity)} ({diagnosis.severity}%)
                </span>
              </div>
              <Progress 
                value={diagnosis.severity} 
                className="h-2 mt-2"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Atenção</h4>
              <p className="text-sm text-yellow-700">
                Este diagnóstico é baseado em análise de imagem por IA. 
                Consulte um técnico agrícola para confirmação e tratamento adequado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Recomendações de Manejo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {diagnosis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-green-800">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="shadow-lg border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <FileText className="h-5 w-5" />
            <span>Gerar Laudo Técnico</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Laudo Técnico em PDF</h4>
              <p className="text-sm text-gray-600">
                Documento completo com diagnóstico, recomendações e dados técnicos
              </p>
            </div>
            <Button onClick={generatePDF} className="bg-green-500 hover:bg-green-600">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisResult;
