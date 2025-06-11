
import { useState, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';

interface CropIdentificationResult {
  cropId: string;
  cropName: string;
  confidence: number;
}

interface UseCropIdentificationReturn {
  identifyCrop: (imageUrl: string) => Promise<CropIdentificationResult>;
  isLoading: boolean;
  error: string | null;
}

// Mapeamento de labels do modelo para nossas culturas
const CROP_MAPPINGS: Record<string, { id: string; name: string }> = {
  'lettuce': { id: 'alface', name: 'Alface' },
  'cabbage': { id: 'alface', name: 'Alface' },
  'leafy green': { id: 'alface', name: 'Alface' },
  'cassava': { id: 'mandioca', name: 'Mandioca' },
  'sweet potato': { id: 'mandioca', name: 'Mandioca' },
  'tomato': { id: 'tomate', name: 'Tomate' },
  'red pepper': { id: 'tomate', name: 'Tomate' },
  'carrot': { id: 'cenoura', name: 'Cenoura' },
  'orange vegetable': { id: 'cenoura', name: 'Cenoura' },
  'corn': { id: 'milho', name: 'Milho' },
  'maize': { id: 'milho', name: 'Milho' },
  'ear': { id: 'milho', name: 'Milho' }
};

export const useCropIdentification = (): UseCropIdentificationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const identifyCrop = useCallback(async (imageUrl: string): Promise<CropIdentificationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Iniciando identificação da cultura...');
      
      // Criar pipeline de classificação de imagens
      const classifier = await pipeline(
        'image-classification',
        'google/vit-base-patch16-224',
        { 
          device: 'webgpu',
          dtype: 'fp32'
        }
      );

      console.log('Pipeline criado, processando imagem...');

      // Classificar a imagem
      const results = await classifier(imageUrl);
      console.log('Resultados da classificação:', results);

      // Encontrar a melhor correspondência com nossas culturas
      let bestMatch: CropIdentificationResult = {
        cropId: 'alface', // padrão
        cropName: 'Alface',
        confidence: 0.3
      };

      for (const result of results) {
        const label = result.label.toLowerCase();
        
        // Procurar correspondências nos mapeamentos
        for (const [key, crop] of Object.entries(CROP_MAPPINGS)) {
          if (label.includes(key) && result.score > bestMatch.confidence) {
            bestMatch = {
              cropId: crop.id,
              cropName: crop.name,
              confidence: result.score
            };
            break;
          }
        }
      }

      console.log('Melhor correspondência encontrada:', bestMatch);
      return bestMatch;

    } catch (err) {
      console.error('Erro na identificação:', err);
      setError('Erro ao identificar a cultura. Usando identificação padrão.');
      
      // Retornar resultado padrão em caso de erro
      return {
        cropId: 'alface',
        cropName: 'Alface',
        confidence: 0.3
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    identifyCrop,
    isLoading,
    error
  };
};
