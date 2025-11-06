'use client'
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { stationService, Station } from '../../services/station.service';
import { carService } from '../../services/car.service';
import styles from './map.module.scss';

// Declare Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options?: any) => any;
        Marker: new (options?: any) => any;
        InfoWindow: new (options?: any) => any;
        Size: new (width: number, height: number) => any;
        Point: new (x: number, y: number) => any;
        MapTypeControlStyle: {
          HORIZONTAL_BAR: any;
        };
        ControlPosition: {
          TOP_RIGHT: any;
        };
      };
    };
    initMap: () => void;
  }
}

interface MapStation extends Station {
  vehicleCount?: number;
  availableVehicles?: number;
  numberOfVehicleTypes?: number;
}

const MapPage: React.FC = () => {
  const [stations, setStations] = useState<MapStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState('TP.HCM');
  const [selectedStation, setSelectedStation] = useState<MapStation | null>(null);
  const [stationCars, setStationCars] = useState<any[]>([]);
  const [showCarList, setShowCarList] = useState(false);
  const [carFiles, setCarFiles] = useState<{[key: number]: string[]}>({});

  useEffect(() => {
    fetchStations();
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = () => {
    if (window.google) {
      initMap();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists, just set callback
      window.initMap = initMap;
      return;
    }

    // Working Google Maps API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDeWCRBnwDdCtRxhEaKxN9i4KtNri1CW5Q';
    
    if (!apiKey) {
      console.error('Google Maps API key is missing!');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initMap;
    document.head.appendChild(script);
  };

  const fetchStations = async () => {
    try {
      const apiStations = await stationService.getAllStations();
      
      // Fetch vehicle count for each station
      const stationsWithVehicles = await Promise.all(
        apiStations.map(async (station) => {
          try {
            const cars = await carService.getAllCars();
            const stationCars = cars.filter(car => car.stationId === station.id);
            
            // Count unique vehicle types (by name)
            const uniqueVehicleTypes = new Set(stationCars.map(car => car.name));
            const numberOfVehicleTypes = uniqueVehicleTypes.size;
            
            return {
              ...station,
              vehicleCount: stationCars.length,
              availableVehicles: stationCars.filter(car => car.availableCount > 0).length,
              numberOfVehicleTypes: numberOfVehicleTypes
            };
          } catch (error) {
            console.error(`Error fetching vehicles for station ${station.id}:`, error);
            return {
              ...station,
              vehicleCount: 0,
              availableVehicles: 0,
              numberOfVehicleTypes: 0
            };
          }
        })
      );

      setStations(stationsWithVehicles);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCityCenter = (city: string) => {
    const centers = {
      'TP.HCM': { lat: 10.7769, lng: 106.7009 },
      'Hà Nội': { lat: 21.0285, lng: 105.8542 },
      'Đà Nẵng': { lat: 16.0544, lng: 108.2022 }
    };
    return centers[city as keyof typeof centers] || centers['TP.HCM'];
  };

  const fetchStationCars = async (stationId: number) => {
    try {
      const cars = await carService.getAllCars();
      const stationCars = cars.filter(car => car.stationId === stationId);
      
      // Fetch images for each car
      const carFilesData: {[key: number]: string[]} = {};
      for (const car of stationCars) {
        try {
          const files = await carService.getCarFiles(car.id);
          carFilesData[car.id] = files.map(file => carService.getImageUrl(file.directus_files_id));
        } catch (error) {
          console.error(`Error fetching files for car ${car.id}:`, error);
          carFilesData[car.id] = [];
        }
      }
      
      setStationCars(stationCars);
      setCarFiles(carFilesData);
    } catch (error) {
      console.error('Error fetching station cars:', error);
      setStationCars([]);
      setCarFiles({});
    }
  };

  const initMap = () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const center = getCityCenter(selectedCity);
    const googleMap = new window.google.maps.Map(mapElement, {
      zoom: 12,
      center: center,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_RIGHT
      },
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(googleMap);

    // Add markers for each station
    stations.forEach((station) => {
      if (station.lat && station.lng) {
        const marker = new window.google.maps.Marker({
          position: { lat: station.lat, lng: station.lng },
          map: googleMap,
          title: station.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="60" height="30" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="56" height="20" fill="white" stroke="#999" stroke-width="1"/>
                <polygon points="28,22 32,30 24,30" fill="white" stroke="#999" stroke-width="1"/>
                <text x="30" y="16" text-anchor="middle" fill="#666" font-size="11" font-weight="bold">
                  ${station.numberOfVehicleTypes || 0} loại xe
                </text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(60, 30),
            anchor: new window.google.maps.Point(30, 30)
          }
        });

        marker.addListener('click', () => {
          setSelectedStation(station);
          fetchStationCars(station.id);
          setShowCarList(true);
        });

      }
    });
  };

  // Re-initialize map when stations are loaded or city changes
  useEffect(() => {
    if (window.google && stations.length > 0) {
      initMap();
    }
  }, [stations, selectedCity]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải bản đồ...</p>
      </div>
    );
  }

  return (
    <div className={styles.mapPage}>
      <div className={styles.mapContainer}>
        <Select
          value={selectedCity}
          onChange={(value) => setSelectedCity(value)}
          className={styles.citySelect}
          options={[
            { value: 'TP.HCM', label: 'TP.HCM' },
            { value: 'Hà Nội', label: 'Hà Nội' },
            { value: 'Đà Nẵng', label: 'Đà Nẵng' }
          ]}
        />
        <div id="map" className={styles.map}></div>
        
        {showCarList && selectedStation && (
          <div className={styles.carListOverlay}>
            <div className={styles.carListHeader}>
              <h3>Xe tại {selectedStation.name}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCarList(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.carList}>
              {stationCars.map((car, index) => (
                <div key={car.id || index} className={styles.carCard}>
                  <div className={styles.carImage}>
                    <img 
                      src={carFiles[car.id] && carFiles[car.id][0] ? carFiles[car.id][0] : '/images/car.png'} 
                      alt={car.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/car.png';
                      }}
                    />
                  </div>
                  <div className={styles.carInfo}>
                    <h4>{car.name}</h4>
                    <p className={styles.carLocation}>{selectedStation.district}, {selectedStation.city}</p>
                    <div className={styles.carRating}>
                      <span>★{car.rating || '5.0'}</span>
                      <span>Có sẵn: {car.availableCount || 0} xe</span>
                    </div>
                    <div className={styles.carPriceRow}>
                      <div className={styles.carPrice}>
                        {car.price ? Math.round(car.price / 1000).toLocaleString() + 'K' : '0K'} /ngày
                      </div>
                      <button 
                        className={styles.viewDetailButton}
                        onClick={() => window.open(`/vehicle/${car.id}`, '_blank')}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
