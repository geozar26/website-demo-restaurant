import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "8e870e1f59cadca07199db1d225e0dec";

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    const searchCity = city.trim().toLowerCase();

    try {
      // encodeURIComponent για σωστή ανάγνωση ελληνικών χαρακτήρων
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric&lang=el`
      );
      
      if (!response.ok) {
        // Δεύτερη προσπάθεια για άτονες λέξεις (πατρα, αθηνα κλπ)
        const secondaryResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric`
        );
        if (!secondaryResponse.ok) throw new Error("Δεν βρέθηκε η πόλη!");
        const secondaryData = await secondaryResponse.json();
        setWeather(secondaryData);
      } else {
        const data = await response.json();
        setWeather(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    app: {
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#007bff', // Το μεγάλο μπλε background
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      margin: 0
    },
    title: {
      fontSize: '2.5rem',
      color: 'white',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
      textAlign: 'center'
    },
    searchContainer: {
      display: 'flex',
      gap: '8px',
      width: '100%',
      maxWidth: '400px',
      backgroundColor: 'white',
      padding: '8px',
      borderRadius: '50px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      marginBottom: '25px'
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      padding: '10px 20px',
      fontSize: '18px',
      borderRadius: '50px'
    },
    button: {
      backgroundColor: '#343a40',
      color: 'white',
      border: 'none',
      padding: '10px 25px',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    card: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '25px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      width: '100%',
      maxWidth: '220px',
      textAlign: 'center',
      marginTop: '10px'
    },
  
    weatherIconBox: {
      backgroundColor: '#007bff', // ΜΠΛΕ ΧΡΩΜΑ (ίδιο με το background της εφαρμογής)
      borderRadius: '20px',
      display: 'inline-block',
      padding: '12px',
      marginBottom: '15px',
      marginTop: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
    },
    weatherIcon: {
      width: '85px', 
      height: '85px',
      display: 'block',
      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
    }
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>☀️ Weather App</h1>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Πόλη (π.χ. Αθήνα)..."
          style={styles.input}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
        />
        <button style={styles.button} onClick={getWeather}>
          Αναζήτηση
        </button>
      </div>

      {loading && <p style={{color: 'white'}}>Φόρτωση...</p>}
      {error && <p style={{ color: '#ffea00', fontWeight: 'bold' }}>⚠️ {error}</p>}

      {weather && (
        <div style={styles.card}>
          <h2 style={{ margin: '0', color: '#333', fontSize: '1.7rem' }}>{weather.name}</h2>
          <p style={{ fontSize: '0.95rem', color: '#666', margin: '5px 0', textTransform: 'capitalize' }}>
            {weather.weather[0].description}
          </p>
          
          <div style={styles.weatherIconBox}>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt="weather icon"
              style={styles.weatherIcon}
            />
          </div>

          <div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#333' }}>
            {Math.round(weather.main.temp)}°C
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
