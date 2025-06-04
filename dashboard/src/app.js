const { useState, useContext, createContext } = React;

const AuthContext = createContext(null);

const users = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'staff', password: 'staff', role: 'staff' }
];

function App() {
  const [user, setUser] = useState(null);
  const [parkingLots, setParkingLots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const login = (u, p) => {
    const found = users.find(x => x.username === u && x.password === p);
    if (found) {
      setUser({ username: found.username, role: found.role });
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={user}>
      {user ? (
        <Dashboard
          user={user}
          logout={logout}
          parkingLots={parkingLots}
          setParkingLots={setParkingLots}
          bookings={bookings}
          setBookings={setBookings}
        />
      ) : (
        <Login onLogin={login} />
      )}
    </AuthContext.Provider>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    onLogin(username, password);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

function Dashboard({ user, logout, parkingLots, setParkingLots, bookings, setBookings }) {
  const [page, setPage] = useState('lots');
  return (
    <div>
      <header>
        <h2>Dashboard ({user.role})</h2>
        <button onClick={logout}>Logout</button>
      </header>
      <nav>
        <button onClick={() => setPage('lots')}>Parking Lots</button>
        <button onClick={() => setPage('bookings')}>Bookings</button>
      </nav>
      {page === 'lots' ? (
        <ParkingLots
          parkingLots={parkingLots}
          setParkingLots={setParkingLots}
          bookings={bookings}
          setBookings={setBookings}
          user={user}
        />
      ) : (
        <Bookings
          parkingLots={parkingLots}
          bookings={bookings}
          setBookings={setBookings}
        />
      )}
    </div>
  );
}

function ParkingLots({ parkingLots, setParkingLots, bookings, setBookings, user }) {
  const [lotName, setLotName] = useState('');
  const [slotCount, setSlotCount] = useState(0);

  const addLot = () => {
    if (!lotName) return;
    const newLot = { id: Date.now(), name: lotName, slots: [] };
    for (let i = 0; i < Number(slotCount); i++) {
      newLot.slots.push({ id: i + 1 });
    }
    setParkingLots([...parkingLots, newLot]);
    setLotName('');
    setSlotCount(0);
  };

  const removeLot = id => {
    setParkingLots(parkingLots.filter(l => l.id !== id));
    setBookings(bookings.filter(b => b.lotId !== id));
  };

  return (
    <div>
      <h3>Parking Lots</h3>
      {user.role === 'admin' && (
        <div>
          <input
            placeholder="Lot name"
            value={lotName}
            onChange={e => setLotName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Slots"
            value={slotCount}
            onChange={e => setSlotCount(e.target.value)}
          />
          <button onClick={addLot}>Add Lot</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slots</th>
            {user.role === 'admin' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {parkingLots.map(lot => (
            <tr key={lot.id}>
              <td>{lot.name}</td>
              <td>{lot.slots.length}</td>
              {user.role === 'admin' && (
                <td>
                  <button onClick={() => removeLot(lot.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bookings({ parkingLots, bookings, setBookings }) {
  const [selectedLot, setSelectedLot] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const availableSlots = () => {
    const lot = parkingLots.find(l => l.id == selectedLot);
    if (!lot) return [];
    const booked = bookings
      .filter(b => b.lotId === lot.id)
      .map(b => b.slotId);
    return lot.slots.filter(s => !booked.includes(s.id));
  };

  const addBooking = () => {
    if (!selectedLot || !selectedSlot) return;
    const newBooking = {
      id: Date.now(),
      lotId: Number(selectedLot),
      slotId: Number(selectedSlot)
    };
    setBookings([...bookings, newBooking]);
    setSelectedSlot('');
  };

  const removeBooking = id => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  return (
    <div>
      <h3>Bookings</h3>
      <div>
        <select value={selectedLot} onChange={e => setSelectedLot(e.target.value)}>
          <option value="">Select lot</option>
          {parkingLots.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}>
          <option value="">Slot</option>
          {availableSlots().map(s => (
            <option key={s.id} value={s.id}>{s.id}</option>
          ))}
        </select>
        <button onClick={addBooking}>Add Booking</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Lot</th>
            <th>Slot</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const lot = parkingLots.find(l => l.id === b.lotId) || { name: '' };
            return (
              <tr key={b.id}>
                <td>{lot.name}</td>
                <td>{b.slotId}</td>
                <td><button onClick={() => removeBooking(b.id)}>Remove</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
