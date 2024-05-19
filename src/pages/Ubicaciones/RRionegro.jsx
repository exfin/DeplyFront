import React, { useEffect, useRef, useState } from 'react';
import './a.css';

function RRionegro () {
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
        center: { lat: 6.1416, lng: -75.4126 },
      });

      
      const rutaRionegroStops = [
        { lat: 6.178285, lng: -75.367920, title: "Sector Belén Rionegro", route: "rionegro" },//
        { lat: 6.160497, lng: -75.369010, title: "Glorieta del Tránsito", route: "rionegro" },
        { lat: 6.152817, lng: -75.369027, title: "Puente de Cuatro Esquinas", route: "rionegro" },
        { lat: 6.149092, lng: -75.378082, title: "Supermercado Éxito Rionegro", route: "rionegro" },
        { lat: 6.146634, lng: -75.379318, title: "CC San Nicolás", route: "rionegro" },
        { lat: 6.142199, lng: -75.380496, title: "Supermercado Jumbo", route: "rionegro" },
        { lat: 6.138285, lng: -75.384879, title: "Mall El Antojo", route: "rionegro" },
        { lat: 6.131672, lng: -75.399217, title: "Colegio Horizontes", route: "rionegro" },
        { lat: 6.124781, lng: -75.421564, title: "Complex de Llanogrande", route: "rionegro" },
        { lat: 6.142842, lng: -75.432941, title: "Glorieta el Tablazo", route: "rionegro" },
        { lat: 6.152020, lng: -75.435617, title: "Hospital San Vicente", route: "rionegro" },
        { lat: 6.176733, lng: -75.436511, title: "Glorieta Aeropuerto JMC", route: "rionegro" },
        { lat: 6.177627, lng: -75.448598, title: "Glorieta Sanjonia", route: "rionegro" },
        { lat: 6.171337, lng: -75.478401, title: "Peaje Variante Palmas", route: "rionegro" },
        { lat: 6.156926, lng: -75.518177, title: "EIA Las Palmas", route: "rionegro" },

    ];

    rutaRionegroStops.forEach(function(stop) {
        const marker = new google.maps.Marker({
            position: { lat: stop.lat, lng: stop.lng },
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            title: stop.title
        });
    });
    };

    // Setup the SSE connection
    const eventSource = new EventSource(import.meta.env.VITE_EVENT_SOURCE_RIONEGRO);
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

  return <div ref={mapRef} className="rutaRionegro" />;
}
export default RRionegro


