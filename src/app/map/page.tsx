'use client'
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { stationService, Station } from '../../services/station.service';
import { vehicleService, Vehicle, getImageUrl } from '../../services/vehicle.service';
import styles from './map.module.scss';

// Declare Google Maps types
interface GoogleMap {
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
}

interface GoogleMarker {
  addListener: (event: string, handler: () => void) => void;
}

interface GoogleMapsOptions {
  zoom?: number;
  center?: { lat: number; lng: number };
  mapTypeControl?: boolean;
  mapTypeControlOptions?: {
    style?: number;
    position?: number;
  };
  styles?: Array<{
    featureType?: string;
    elementType?: string;
    stylers?: Array<{ visibility?: string }>;
  }>;
}

interface MarkerOptions {
  position?: { lat: number; lng: number };
  map?: GoogleMap;
  title?: string;
  icon?: {
    url?: string;
    scaledSize?: { width: number; height: number };
    anchor?: { x: number; y: number };
  };
}

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options?: GoogleMapsOptions) => GoogleMap;
        Marker: new (options?: MarkerOptions) => GoogleMarker;
        InfoWindow: new (options?: Record<string, unknown>) => unknown;
        Size: new (width: number, height: number) => { width: number; height: number };
        Point: new (x: number, y: number) => { x: number; y: number };
        MapTypeControlStyle: {
          HORIZONTAL_BAR: number;
        };
        ControlPosition: {
          TOP_RIGHT: number;
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
  const [, setMap] = useState<GoogleMap | null>(null);
  const [selectedCity, setSelectedCity] = useState('TP.HCM');
  const [selectedStation, setSelectedStation] = useState<MapStation | null>(null);
  const [stationVehicles, setStationVehicles] = useState<Vehicle[]>([]);
  const [showCarList, setShowCarList] = useState(false);
  const [vehicleImages, setVehicleImages] = useState<{[key: number]: string[]}>({});
  const carListRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
            const vehicles = await vehicleService.getVehiclesByStation(station.id);
            
            // Count unique vehicle types (by model name)
            const uniqueVehicleTypes = new Set(
              vehicles
                .filter(v => v.vehicleModel?.name)
                .map(v => v.vehicleModel!.name)
            );
            const numberOfVehicleTypes = uniqueVehicleTypes.size;
            
            return {
              ...station,
              vehicleCount: vehicles.length,
              availableVehicles: vehicles.filter(v => v.status === 'available').length,
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

  const fetchStationVehicles = async (stationId: number) => {
    try {
      const vehicles = await vehicleService.getVehiclesByStation(stationId);
      
      // Fetch images for each vehicle
      const vehicleImagesData: {[key: number]: string[]} = {};
      for (const vehicle of vehicles) {
        try {
          if (vehicle.images && vehicle.images.length > 0) {
            vehicleImagesData[vehicle.id] = vehicle.images.map(image => getImageUrl(image));
          } else {
            vehicleImagesData[vehicle.id] = [];
          }
        } catch (error) {
          console.error(`Error fetching images for vehicle ${vehicle.id}:`, error);
          vehicleImagesData[vehicle.id] = [];
        }
      }
      
      setStationVehicles(vehicles);
      setVehicleImages(vehicleImagesData);
    } catch (error) {
      console.error('Error fetching station vehicles:', error);
      setStationVehicles([]);
      setVehicleImages({});
    }
  };

  const checkScrollButtons = () => {
    if (carListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carListRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollCarList = (direction: 'left' | 'right') => {
    if (carListRef.current) {
      const scrollAmount = 440; // 420px card width + 16px gap
      const currentScroll = carListRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      carListRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  // Check scroll buttons when vehicles change or list is shown
  useEffect(() => {
    if (showCarList && stationVehicles.length > 0) {
      // Wait for DOM to update
      const timer = setTimeout(() => {
        checkScrollButtons();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showCarList, stationVehicles]);

  // Check scroll buttons on scroll
  useEffect(() => {
    const carList = carListRef.current;
    if (carList) {
      carList.addEventListener('scroll', checkScrollButtons);
      // Also check on resize
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        carList.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [showCarList]);

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

    // Add markers for each station (only if they have vehicles)
    stations.forEach((station) => {
      if (station.lat && station.lng && station.vehicleCount && station.vehicleCount > 0) {
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
                  ${station.vehicleCount || 0} xe
                </text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(60, 30),
            anchor: new window.google.maps.Point(30, 30)
          }
        });

        marker.addListener('click', () => {
          setSelectedStation(station);
          fetchStationVehicles(station.id);
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
            <div className={styles.carListWrapper}>
              {canScrollLeft && (
                <button 
                  className={styles.scrollButton}
                  onClick={() => scrollCarList('left')}
                  aria-label="Previous"
                >
                  <LeftOutlined />
                </button>
              )}
              <div className={styles.carList} ref={carListRef}>
                {stationVehicles.map((vehicle, index) => (
                <div key={vehicle.id || index} className={styles.carCard}>
                  <div className={styles.carImage}>
                    <img 
                      src={vehicleImages[vehicle.id] && vehicleImages[vehicle.id][0] 
                        ? vehicleImages[vehicle.id][0] 
                        : '/images/car.png'} 
                      alt={vehicle.vehicleModel?.name || 'Vehicle'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/car.png';
                      }}
                    />
                  </div>
                  <div className={styles.carInfo}>
                    <h4>{vehicle.vehicleModel?.name || 'N/A'}</h4>
                    <p className={styles.carLocation}>{selectedStation.district}, {selectedStation.city}</p>
                    <div className={styles.carRating}>
                      <span>★{vehicle.rating?.toFixed(1) || '5.0'}</span>
                      <span>Biển số: {vehicle.license_plate}</span>
                    </div>
                    <div className={styles.carPriceRow}>
                      <div className={styles.carPrice}>
                        {vehicle.vehicleModel?.price 
                          ? Math.round(vehicle.vehicleModel.price / 1000).toLocaleString() + 'K' 
                          : '0K'} /ngày
                      </div>
                      <button 
                        className={styles.viewDetailButton}
                        onClick={() => window.open(`/vehicle/${vehicle.id}`, '_blank')}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
              {canScrollRight && (
                <button 
                  className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
                  onClick={() => scrollCarList('right')}
                  aria-label="Next"
                >
                  <RightOutlined />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
