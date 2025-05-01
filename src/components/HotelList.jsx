import React from "react";

const HotelList = ({ hotels }) => {
  console.log("▶ Hotels array:", hotels); // DEBUG

  if (!hotels || hotels.length === 0) {
    return <p>Nincs találat.</p>;
  }

  return (
    <div className="hotel-list">
      {hotels.map((hotel, index) => {
        const name = hotel.name || "Név nem elérhető";
        const price = hotel.min_price?.amount;
        const currency = hotel.min_price?.currency || "HUF";
        const image = hotel.photo_urls?.[0] || hotel.main_photo_url || "";

        return (
          <div key={index} className="hotel-card">
            {image && <img src={image} alt={name} width="200" />}
            <h3>{name}</h3>
            <p>
              Ár: {price ? `${price} ${currency}` : "Nem elérhető"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default HotelList;
