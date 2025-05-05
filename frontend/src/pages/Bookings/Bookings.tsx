import { useEffect, useState } from "react";

// Typ för en bokning
type Booking = {
  _id: string;
  user: string;
  room: string;
  date: string;
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Hämta bokningar från backend vid sidladdning
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Fel vid hämtning av bokningar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mina bokningar</h1>
      {loading ? (
        <p>Laddar bokningar...</p>
      ) : bookings.length === 0 ? (
        <p>Inga bokningar hittades.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="border p-4 rounded-md bg-white shadow"
            >
              <p><strong>Rum:</strong> {booking.room}</p>
              <p><strong>Datum:</strong> {new Date(booking.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings;
