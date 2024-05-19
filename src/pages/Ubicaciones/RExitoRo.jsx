import React, { useEffect, useRef, useState } from 'react';
import './a.css';

function RExitoRo () {
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
      const rutaExitoRobledoStops = [
        { lat: 6.241547, lng: -75.602736, title: "Éxito de Robledo" },
        { lat: 6.263281, lng: -75.596611, title: "Rotonda de Colombia con la 80"},
        { lat: 6.259992, lng: -75.590388, title: "Avenida Centenario" },
        { lat: 6.256659, lng: -75.592041, title: "Centro Comercial Obelisco" },
        { lat: 6.258594, lng: -75.596132, title: "Carrera 78" },
        { lat: 6.246131, lng: -75.577173, title: "Edificio Inteligente" },
        { lat: 6.238305, lng: -75.573229, title: "Paradero de Exposiciones" },
        { lat: 6.237100, lng: -75.569929, title: "San Diego" },
        { lat: 6.227603, lng: -75.564595, title: "Loma El Indio" },
        { lat: 6.171274, lng: -75.546824, title: "Palmas" },
        { lat: 6.153486, lng: -75.532917, title: "Mall Indiana / Alto de Palmas" },
        { lat: 6.156926, lng: -75.518177, title: "EIA Las Palmas" },
    ];

    rutaExitoRobledoStops.forEach(function(stop) {
        const marker = new google.maps.Marker({
            position: { lat: stop.lat, lng: stop.lng },
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
            title: stop.title
        });
    });
    };

    // Setup the SSE connection
    const eventSource = new EventSource(import.meta.env.VITE_EVENT_SOURCE_EXITO);
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

  return <div ref={mapRef} className="rutaExitoRo" />;
}
export default RExitoRo
