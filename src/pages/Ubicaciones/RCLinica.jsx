import React, { useEffect, useRef, useState } from 'react';
import './a.css';

function RCLinica() {
  const mapRef = useRef(null); // El div del mapa
  const map = useRef(null); // Objeto mapa
  const markers = useRef([]); // Lista de los marcadores

  useEffect(() => {
   
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

    
    const initializeMap = () => {
      map.current = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 6.2476, lng: -75.5658 },
      });
    };

    const eventSource = new EventSource(import.meta.env.VITE_EVENT_SOURCE_CLINICA);
    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      addMarker(data);
    };

    loadGoogleMapsScript();

    
    const addMarker = (data) => {
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);
      console.log(latitude);
      console.log(longitude);
  
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

  return <div ref={mapRef} className="rutaClinica" />;
}

export default RCLinica;
