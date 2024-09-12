import React, { useState, useEffect } from "react";
import { getData } from '../features/apiService';
import LinearProgress from '@mui/material/LinearProgress';

const OpenStreetMapIframeWithAddress = ({ address }) => {
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    const fetchCoordinates = async () => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
      
        const data = await getData(url);
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          // Parse lat/lon as floats and calculate a smaller bbox margin
          const latFloat = parseFloat(lat);
          const lonFloat = parseFloat(lon);
          const bbox = `${lonFloat - 0.004},${latFloat - 0.004},${
            lonFloat + 0.004
          },${latFloat + 0.004}`;
          const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}&zoom=14`; // Added zoom parameter
          console.log("src:", src);
          setIframeSrc(src);
        } else {
          console.error("Address not found");
        }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <div>
      <h1>Map for: {address}</h1>
      {iframeSrc ? (
        <iframe
          width="100%"
          height="500"
          src={iframeSrc}
          style={{ border: "1px solid black" }}
          allowFullScreen=""
          loading="lazy"
          title="OpenStreetMap Embed"
        ></iframe>
      ) : (
        <LinearProgress />
      )}
    </div>
  );
};

export default OpenStreetMapIframeWithAddress;
