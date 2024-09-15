import React, { useState, useEffect } from "react";
import { getData } from '../features/apiService';
import LinearProgress from '@mui/material/LinearProgress';

const OpenStreetMapIframeWithAddress = ({ address }) => {
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    const fetchCoordinates = async () => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
      
        const data = await getData(url);
        console.log("data:", data);
        let src = "";
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          // Parse lat/lon as floats and calculate a smaller bbox margin
          const latFloat = parseFloat(lat);
          const lonFloat = parseFloat(lon);
          const bbox = `${lonFloat - 0.004},${latFloat - 0.004},${
            lonFloat + 0.004
          },${latFloat + 0.004}`;
          //const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}&zoom=14`; // Added zoom parameter
          src = `https://maps.google.com/maps?q=${lat},${lon}&hl=he&t=&z=16&ie=UTF8&iwloc=B&output=embed`
          console.log("src:", src);
        } else {
          
        }
        src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=he&t=&z=16&ie=UTF8&iwloc=B&output=embed`;
        setIframeSrc(src);
    };

    fetchCoordinates();
  }, [address]);

  return (
    <div>
      <h1>Map for: {address}</h1>
      {iframeSrc ? (<>
        <iframe
          width="100%"
          height="450"
          src={iframeSrc}
          style={{ border: "1px solid black" }}
          allowFullScreen=""
          //loading="lazy"
          title="OpenStreetMap Embed"
          frameborder="0"
          marginheight="0" 
          marginwidth="0" 
          id="gmap_canvas"
        ></iframe>
      </>
      ) : (
        <LinearProgress />
      )}
    </div>
  );
};

export default OpenStreetMapIframeWithAddress;
