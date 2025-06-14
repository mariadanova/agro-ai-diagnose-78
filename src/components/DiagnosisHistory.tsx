
import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Calendar, Leaf, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';

interface HistoryEntry {
  id: number;
  date: string;
  plantName: string;
  disease: string;
  severity: number;
  confidence: number;
  image: string;
  recommendations?: string[];
}

interface DiagnosisHistoryProps {
  onBack: () => void;
}

const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({ onBack }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const historyData = JSON.parse(localStorage.getItem('agroia-history') || '[]');
    setHistory(historyData);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: number) => {
    if (severity < 30) return 'bg-green-100 text-green-800';
    if (severity < 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity < 30) return 'Leve';
    if (severity < 70) return 'Moderada';
    return 'Severa';
  };

  const downloadPDF = (entry: HistoryEntry) => {
    const doc = new jsPDF();
    const analysisDate = new Date(entry.date).toLocaleDateString('pt-BR');
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('LAUDO TÉCNICO - agro.IA', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Data da Análise: ${analysisDate}`, 20, 35);
    
    // Linha separadora
    doc.line(20, 40, 190, 40);
    
    // Informações da planta
    doc.setFontSize(16);
    doc.text('INFORMAÇÕES DA ANÁLISE', 20, 55);
    
    doc.setFontSize(12);
    doc.text(`Cultura: ${entry.plantName}`, 20, 70);
    doc.text(`Doença Identificada: ${entry.disease}`, 20, 85);
    doc.text(`Severidade: ${getSeverityLabel(entry.severity)} (${entry.severity}%)`, 20, 100);
    doc.text(`Confiança do Diagnóstico: ${entry.confidence}%`, 20, 115);
    
    // Recomendações (se disponíveis)
    if (entry.recommendations && entry.recommendations.length > 0) {
      doc.setFontSize(16);
      doc.text('RECOMENDAÇÕES DE MANEJO', 20, 140);
      
      doc.setFontSize(12);
      let yPosition = 155;
      entry.recommendations.forEach((rec, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }
    
    // Disclaimer
    const disclaimerY = entry.recommendations ? 220 : 140;
    doc.setFontSize(10);
    doc.text('IMPORTANTE: Este diagnóstico é baseado em análise de imagem por IA.', 20, disclaimerY);
    doc.text('Consulte um técnico agrícola para confirmação e tratamento adequado.', 20, disclaimerY + 10);
    
    // Rodapé
    doc.setFontSize(8);
    doc.text('© 2025 agro.IA - Tecnologia a serviço da agricultura', 20, 280);
    
    // Salvar o PDF
    doc.save(`laudo-${entry.plantName}-${entry.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Histórico de Diagnósticos</h2>
          <p className="text-gray-600">Seus últimos diagnósticos realizados</p>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="py-12 text-center">
            <Leaf className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum diagnóstico encontrado
            </h3>
            <p className="text-gray-500">
              Faça seu primeiro diagnóstico para ver o histórico aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((entry) => (
            <Card key={entry.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Image */}
                  <img
                    src={entry.image}
                    alt={`Diagnóstico ${entry.plantName}`}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {entry.plantName}
                        </Badge>
                        <Badge className={getSeverityColor(entry.severity)}>
                          {getSeverityLabel(entry.severity)}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(entry.date)}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900">
                      {entry.disease}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Confiança:</span> {entry.confidence}%
                        <span className="mx-2">•</span>
                        <span className="font-medium">Severidade:</span> {entry.severity}%
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPDF(entry)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>PDF</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      {history.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{history.length}</div>
                <div className="text-sm text-gray-600">Total de Diagnósticos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(history.reduce((sum, h) => sum + h.confidence, 0) / history.length)}%
                </div>
                <div className="text-sm text-gray-600">Confiança Média</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {history.filter(h => h.severity >= 70).length}
                </div>
                <div className="text-sm text-gray-600">Casos Severos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(history.map(h => h.plantName)).size}
                </div>
                <div className="text-sm text-gray-600">Culturas Analisadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiagnosisHistory;
