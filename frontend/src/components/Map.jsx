import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useMemo, useState, useEffect } from 'react';
import { api } from '../services/api';

const libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function Map({ itinerary, selectedLocations, cityCenter }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const mapData = useMemo(() => {
    if (!selectedLocations || !selectedLocations.length) return { markers: [] };
    
    const markers = [];
    
    if (itinerary && itinerary.length > 0) {
      // Flatten all schedules
      const schedules = itinerary.flatMap(day => day.schedule);
      
      schedules.forEach((item, index) => {
        const locData = selectedLocations.find(l => l.name === item.location);
        if (locData) {
          const point = { lat: locData.lat, lng: locData.lng };
          markers.push({ ...point, label: (index + 1).toString(), title: item.location });
        }
      });
    } else {
      // Preview mode: Just plot the selected locations without lines
      selectedLocations.forEach((loc) => {
        markers.push({ lat: loc.lat, lng: loc.lng, title: loc.name });
      });
    }

    return { markers };
  }, [itinerary, selectedLocations]);

  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (!isLoaded || mapData.markers.length < 2 || !itinerary || itinerary.length === 0) {
      setDirections(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const origin = mapData.markers[0];
    const destination = mapData.markers[mapData.markers.length - 1];
    const waypoints = mapData.markers.slice(1, -1).map(marker => ({
      location: marker,
      stopover: true
    }));

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [isLoaded, mapData.markers]);

  const center = mapData.markers.length > 0 
    ? mapData.markers[0] 
    : (cityCenter || { lat: 18.944, lng: 72.823 }); // Fallback Mumbai

  if (loadError) return <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center text-red-400">Error loading map</div>;
  if (!isLoaded) return <div className="w-full h-full bg-slate-800 animate-pulse rounded-xl"></div>;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={{
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
          ],
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {mapData.markers.map((marker, i) => (
          <Marker 
            key={i} 
            position={marker} 
            label={marker.label ? { text: marker.label, color: 'white', fontWeight: 'bold' } : undefined}
            title={marker.title}
          />
        ))}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#3b82f6',
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
