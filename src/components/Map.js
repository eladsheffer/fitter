import React, { useState, useEffect } from "react";

const OpenStreetMapIframeWithAddress = ({ address }) => {
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address
          )}&format=json`
        );
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          // Parse lat/lon as floats and calculate a smaller bbox margin
          const latFloat = parseFloat(lat);
          const lonFloat = parseFloat(lon);
          const bbox = `${lonFloat - 0.02},${latFloat - 0.02},${
            lonFloat + 0.02
          },${latFloat + 0.02}`;
          const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}&zoom=14`; // Added zoom parameter
          console.log("src:", src);
          setIframeSrc(src);
        } else {
          console.error("Address not found");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <div>
      <h1>Map for: {address}</h1>
      {iframeSrc ? (
        <iframe
          width="600"
          height="450"
          src={iframeSrc}
          style={{ border: "1px solid black" }}
          allowFullScreen=""
          loading="lazy"
          title="OpenStreetMap Embed"
        ></iframe>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default OpenStreetMapIframeWithAddress;
