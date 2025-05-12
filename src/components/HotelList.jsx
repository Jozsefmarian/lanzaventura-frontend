import { Link } from "react-router-dom";
import "../styles/HotelList.css";

export default function HotelList({ hotels }) {
  if (!hotels || hotels.length === 0) {
    return <p className="no-results">Nem találtunk szállást a megadott időszakra.</p>;
  }

  return (
    <div className="hotel-list-vertical">
      {hotels.map((hotel) => (
        <Link to={`/hotel/${hotel.id}`} key={hotel.id} className="hotel-card-horizontal">
          {hotel.mainPhoto && (
            <img
              src={hotel.mainPhoto}
              alt={hotel.name}
              className="hotel-image"
            />
          )}
          <div className="hotel-info">
            <h2 className="hotel-name">{hotel.name}</h2>
            {hotel.address && hotel.address !== "N/A" && (
  <p className="hotel-address">{hotel.address}</p>
)}

{hotel.starRating && (
  <p className="hotel-stars">⭐ {hotel.starRating} csillag</p>
)}
          </div>
        </Link>
      ))}
    </div>
  );
}
