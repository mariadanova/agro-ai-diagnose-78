import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Thermometer, Droplets, AlertTriangle, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  rainfall: number;
  location: string;
}

interface IrrigationAlert {
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  action: string;
}

interface WeatherIrrigationProps {
  onBack: () => void;
}

const WeatherIrrigation: React.FC<WeatherIrrigationProps> = ({ onBack }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [alerts, setAlerts] = useState<IrrigationAlert[]>([]);
  const { toast } = useToast();

  const generateMockWeatherData = (city: string): WeatherData => {
    // Simular dados meteorológicos realistas
    const temp = 20 + Math.random() * 15; // 20-35°C
    const humidity = 40 + Math.random() * 40; // 40-80%
    const wind = Math.random() * 20; // 0-20 km/h
    const rain = Math.random() * 10; // 0-10mm

    const conditions = ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuvoso'];
    const description = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(humidity),
      description,
      windSpeed: Math.round(wind * 10) / 10,
      rainfall: Math.round(rain * 10) / 10,
      location: city
    };
  };

  const fetchWeatherData = async () => {
    if (!location.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome da cidade",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (apiKey.trim()) {
        // Usar API real do OpenWeatherMap se a chave for fornecida
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=pt_br`
        );
        
        if (response.ok) {
          const data = await response.json();
          const weatherData: WeatherData = {
            temperature: Math.round(data.main.temp * 10) / 10,
            humidity: data.main.humidity,
            description: data.weather[0].description,
            windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10, // Convert m/s to km/h
            rainfall: data.rain?.['1h'] || 0,
            location: data.name
          };
          setWeatherData(weatherData);
        } else {
          throw new Error('Falha ao buscar dados meteorológicos');
        }
      } else {
        // Usar dados simulados se não houver API key
        const mockData = generateMockWeatherData(location);
        setWeatherData(mockData);
        toast({
          title: "Dados Simulados",
          description: "Usando dados meteorológicos simulados. Insira uma chave da API OpenWeatherMap para dados reais.",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar clima:', error);
      // Fallback para dados simulados em caso de erro
      const mockData = generateMockWeatherData(location);
      setWeatherData(mockData);
      toast({
        title: "Usando Dados Simulados",
        description: "Não foi possível acessar dados reais. Mostrando dados simulados.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateIrrigationAlerts = (weather: WeatherData): IrrigationAlert[] => {
    const alerts: IrrigationAlert[] = [];

    // Alerta de temperatura alta
    if (weather.temperature > 30) {
      alerts.push({
        type: 'warning',
        title: 'Temperatura Elevada',
        message: `Temperatura de ${weather.temperature}°C pode causar estresse hídrico nas plantas.`,
        action: 'Aumente a frequência de irrigação e considere irrigar no início da manhã ou final da tarde.'
      });
    }

    // Alerta de umidade baixa
    if (weather.humidity < 50) {
      alerts.push({
        type: 'warning',
        title: 'Umidade Baixa',
        message: `Umidade de ${weather.humidity}% está abaixo do ideal para a maioria das culturas.`,
        action: 'Monitore as plantas de perto e irrigue conforme necessário.'
      });
    }

    // Alerta de chuva
    if (weather.rainfall > 5) {
      alerts.push({
        type: 'info',
        title: 'Chuva Registrada',
        message: `${weather.rainfall}mm de chuva nas últimas horas.`,
        action: 'Reduza ou suspenda a irrigação temporariamente.'
      });
    }

    // Alerta de vento forte
    if (weather.windSpeed > 15) {
      alerts.push({
        type: 'warning',
        title: 'Vento Forte',
        message: `Ventos de ${weather.windSpeed} km/h podem aumentar a evapotranspiração.`,
        action: 'Monitore a umidade do solo mais frequentemente.'
      });
    }

    // Condições ideais
    if (weather.temperature >= 20 && weather.temperature <= 25 && weather.humidity >= 60 && weather.rainfall < 2) {
      alerts.push({
        type: 'info',
        title: 'Condições Favoráveis',
        message: 'Condições climáticas ideais para a maioria das culturas.',
        action: 'Mantenha o regime de irrigação normal.'
      });
    }

    return alerts;
  };

  useEffect(() => {
    if (weatherData) {
      const newAlerts = generateIrrigationAlerts(weatherData);
      setAlerts(newAlerts);
    }
  }, [weatherData]);

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('chuv') || desc.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (desc.includes('nubla') || desc.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    } else {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'danger': return 'destructive';
      case 'warning': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Clima e Irrigação</h2>
        </div>
      </div>

      {/* Weather Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Configuração de Local</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Cidade</Label>
              <Input
                id="location"
                placeholder="Ex: São Paulo, SP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="api-key">Chave API OpenWeatherMap (Opcional)</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Sua chave da API para dados reais"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={fetchWeatherData} disabled={loading} className="w-full">
            {loading ? 'Buscando...' : 'Buscar Clima'}
          </Button>
          <p className="text-xs text-gray-500">
            Obtenha uma chave gratuita em{' '}
            <a 
              href="https://openweathermap.org/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              openweathermap.org
            </a>
          </p>
        </CardContent>
      </Card>

      {weatherData && (
        <>
          {/* Current Weather */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Temperatura</p>
                    <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                  </div>
                  <Thermometer className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Umidade</p>
                    <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                  </div>
                  <Droplets className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Condição</p>
                    <p className="text-lg font-semibold capitalize">{weatherData.description}</p>
                  </div>
                  {getWeatherIcon(weatherData.description)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vento</p>
                    <p className="text-2xl font-bold">{weatherData.windSpeed} km/h</p>
                  </div>
                  <Cloud className="h-8 w-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{weatherData.location}</span>
                {weatherData.rainfall > 0 && (
                  <Badge variant="secondary">
                    {weatherData.rainfall}mm de chuva
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Irrigation Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Alertas de Irrigação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.length === 0 ? (
                <p className="text-gray-500">Nenhum alerta no momento.</p>
              ) : (
                alerts.map((alert, index) => (
                  <Alert key={index} variant={getAlertVariant(alert.type)}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-sm font-medium">💡 {alert.action}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>

          {/* Irrigation Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Gerais de Irrigação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-700">Melhores Horários</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Manhã cedo (6h-8h)</li>
                    <li>• Final da tarde (17h-19h)</li>
                    <li>• Evite horários de sol forte</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-700">Sinais de Sede das Plantas</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Folhas murchas ou caídas</li>
                    <li>• Solo seco a 2-3cm de profundidade</li>
                    <li>• Crescimento lento</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WeatherIrrigation;