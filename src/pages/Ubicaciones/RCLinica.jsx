import React, { useEffect, useRef } from 'react';
import './a.css';

function RCLinica() {
  const mapRef = useRef(null); 

  useEffect(() => {
    
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initializeMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => initializeMap();
        document.body.appendChild(script);
      }
    };

    
    const initializeMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 6.2476, lng: -75.5658 },
      });

     
      const marker = new window.google.maps.Marker({
        position: { lat: 6.158760098288912, lng: -75.51847096396926 },
        map: map,
        title: 'EIA'
        
      });
    };

    loadGoogleMapsScript();

    
    return () => {
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