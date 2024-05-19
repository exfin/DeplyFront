import React, { useEffect, useRef, useState } from 'react';
import './a.css';

function RSOABosque () {
  const mapRef = useRef(null); // Reference to the div element where the map will be
  const map = useRef(null); // Reference to the Google Maps object
  const markers = useRef([]); // Reference to the list of markers

  useEffect(() => {
    // Dynamically load the Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && mapRef.current && !map.current) {
        initializeMap();
      } else if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (mapRef.current && !map.current) {
            initializeMap();
          }
        };
        document.body.appendChild(script);
      }
    };

    // Initialize the map
    const initializeMap = () => {
      map.current = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 6.2476, lng: -75.5658 },
      });

      const rutaBosquesStops = [
        { lat: 6.180583, lng: -75.581105, title: "Bahía Calle 25 Sur", route: "bosques" },
        { lat: 6.184739, lng: -75.582513, title: "Clínica Especialidades Oftalmológicas", route: "bosques" },
        { lat: 6.183178, lng: -75.579842, title: "Supermercado Euro La Frontera", route: "bosques" },
        { lat: 6.180823, lng: -75.568105, title: "Mall San Lucas", route: "bosques" },
        { lat: 6.186839, lng: -75.561954, title: "Complex de Los Balsos", route: "bosques" },
        { lat: 6.184179, lng: -75.547467, title: "Restaurante Marmoleo", route: "bosques" },
        { lat: 6.171274, lng: -75.546824, title: "Palmas", route: "bosques" },
        { lat: 6.153486, lng: -75.532917, title: "Mall Indiana / Alto de Palmas", route: "bosques" },
        { lat: 6.156926, lng: -75.518177, title: "EIA Las Palmas", route: "bosques" },
    ];

    rutaBosquesStops.forEach(function(stop) {
        const marker = new google.maps.Marker({
            position: { lat: stop.lat, lng: stop.lng },
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            title: stop.title
        });
    });
    };

    // Setup the SSE connection
    const eventSource = new EventSource(import.meta.env.VITE_EVENT_SOURCE_SOFASA);
    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      addMarker(data);
    };

    loadGoogleMapsScript();

    // Function to add a marker to the map
    const addMarker = (data) => {
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);
  
      if (!isNaN(latitude) && !isNaN(longitude)) {
          const newMarker = new window.google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map: map.current,
              title: 'New Location'
          });
          markers.current.push(newMarker);
      } else {
          console.error('Invalid latitude or longitude');
      }
  };
  

    // Clean up on component unmount
    return () => {
      eventSource.close();
      const scripts = document.querySelectorAll('script');
      for (let script of scripts) {
        if (script.src.includes('maps.googleapis.com')) {
          script.remove();
        }
      }
    };
  }, []);

  return <div ref={mapRef} className="rutaSofaABosque" />;
}
export default RSOABosque

