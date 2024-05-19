import React, { useEffect, useRef, useState } from 'react';
import './a.css';

function RMAyorca () {
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
      
      const rutaMayorcaStops = [
        { lat: 6.162508, lng: -75.6052413, title: "Paradero Centro Comercial Mayorca", route: "mayorca" },
        { lat: 6.177702, lng: -75.595260, title: "Viva Envigado", route: "mayorca" },
        { lat: 6.173689, lng: -75.596990, title: "Barrio Alcalá", route: "mayorca" },
        { lat: 6.168286, lng: -75.588198, title: "Esquina Carrera 42, sector Guanteros", route: "mayorca" },
        { lat: 6.164881, lng: -75.583104, title: "Carrera 33, lugar conocido como Famidrogas", route: "mayorca" },
        { lat: 6.160037, lng: -75.579685, title: "Sector Camino Verde, cerca al Hospital Manuel Uribe Ángel", route: "mayorca" },
        { lat: 6.164158, lng: -75.574841, title: "Centro Comercial City Plaza", route: "mayorca" },
        { lat: 6.180823, lng: -75.568105, title: "Mall San Lucas", route: "mayorca" },
        { lat: 6.186966, lng: -75.561448, title: "Loma Los Balsos", route: "mayorca" },
        { lat: 6.185159, lng: -75.553037, title: "Glorieta Parque Roa", route: "mayorca" },
        { lat: 6.153486, lng: -75.532917, title: "Mall Indiana / Alto de Palmas", route: "mayorca" },
        { lat: 6.156926, lng: -75.518177, title: "EIA Las Palmas", route: "mayorca" },
    ];

    rutaMayorcaStops.forEach(function(stop) {
        const marker = new google.maps.Marker({
            position: { lat: stop.lat, lng: stop.lng },
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            title: stop.title
        });
    });
      

    };

    // Setup the SSE connection
    const eventSource = new EventSource(import.meta.env.VITE_EVENT_SOURCE_MAYORCA);
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

  return <div ref={mapRef} className="rutaMayorca" />;
}
export default RMAyorca
