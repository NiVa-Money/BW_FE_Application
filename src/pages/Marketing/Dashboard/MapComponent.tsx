/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  getMarketingInsightsService,
} from "../../../api/services/marketingDashboardService";

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // default center (e.g., India)
  const [loading, setLoading] = useState(true);

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Customize the payload as needed
        const data = await getMarketingInsightsService();
        const regions = data.geographicalActivity?.interestByRegion || [];

        if (isLoaded) {
          const geocoder = new window.google.maps.Geocoder();

          // Geocode each region's location to obtain coordinates
          const geocodePromises = regions.map((region) => {
            return new Promise((resolve) => {
              geocoder.geocode(
                { address: region.location },
                (results, status) => {
                  if (status === "OK" && results[0]) {
                    resolve({
                      id: region.geo,
                      location: region.location,
                      value: region.extracted_value,
                      position: results[0].geometry.location.toJSON(),
                    });
                  } else {
                    console.error("Geocode error for", region.location, status);
                    resolve(null);
                  }
                }
              );
            });
          });

          const results = await Promise.all(geocodePromises);
          const validMarkers = results.filter((marker) => marker !== null);
          setMarkers(validMarkers);

          // Calculate an average center for all markers
          if (validMarkers.length > 0) {
            const avg = validMarkers.reduce(
              (acc, marker) => ({
                lat: acc.lat + marker.position.lat,
                lng: acc.lng + marker.position.lng,
              }),
              { lat: 0, lng: 0 }
            );

            setCenter({
              lat: avg.lat / validMarkers.length,
              lng: avg.lng / validMarkers.length,
            });
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching marketing insights:", error);
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchData();
    }
  }, [isLoaded]);

  if (!isLoaded || loading) return <div>Loading Map...</div>;

  return (
    <div className="w-full h-64">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={5}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={`${marker.location}: ${marker.value}`}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
