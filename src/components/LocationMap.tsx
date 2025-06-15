import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationMapProps {
  location: GeolocationPosition;
}

const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [location.coords.longitude, location.coords.latitude],
      zoom: 16,
    });

    // Adicionar marcador na localização
    new mapboxgl.Marker({
      color: '#10b981'
    })
      .setLngLat([location.coords.longitude, location.coords.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">Local da Captura</h3>
              <p class="text-sm">Lat: ${location.coords.latitude.toFixed(6)}</p>
              <p class="text-sm">Long: ${location.coords.longitude.toFixed(6)}</p>
              <p class="text-sm">Precisão: ${location.coords.accuracy.toFixed(0)}m</p>
            </div>
          `)
      )
      .addTo(map.current);

    // Adicionar controles de navegação
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
      initializeMap();
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenSet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurar Mapa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mapbox-token">Token do Mapbox</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZSI..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Obtenha seu token gratuito em{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <Button onClick={handleTokenSubmit} className="w-full">
            Carregar Mapa
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default LocationMap;