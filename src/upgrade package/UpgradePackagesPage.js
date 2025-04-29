import React, { useState } from 'react';
import { API_ROUTES } from '../app modules/apiRoutes';

const inputStyle = {
  padding: '12px',
  width: '100%',
  maxWidth: '400px',
  fontSize: '16px',
  borderRadius: '10px',
  border: '1px solid #ccc',
  marginBottom: '20px',
  transition: 'all 0.3s ease-in-out',
};

const cardStyle = {
  padding: '15px',
  borderRadius: '12px',
  marginBottom: '15px',
  background: '#2C2C2E',
  color: 'white',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};

const cardHoverStyle = {
  transform: 'scale(1.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
};

const upgradeBtn = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  background: '#0A84FF',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 500,
  transition: 'background 0.3s ease, transform 0.3s ease',
};

const disabledBtn = {
  ...upgradeBtn,
  background: '#555',
  cursor: 'not-allowed',
  opacity: 0.6,
};

const loadingStyle = {
  textAlign: 'center',
  padding: '20px',
  color: '#ddd',
};

const PACKAGE_RANKS = {
  1: 1, // Non-Residential
  3: 2, // Residential 2 Sharing
  2: 3, // Residential Single
  4: 4, // Double Occupancy
};

const UpgradePackagesPage = () => {
  const [query, setQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUserPackages = () => {
    setLoading(true);
    fetch(`${API_ROUTES.baseUrl}/api/user-packages?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setUserData(null);
        } else {
          setError('');
          setUserData(data);
        }
        setLoading(false);
      });
  };

  const getHighestOwnedRank = () => {
    return Math.max(...userData.userPackages.map((p) => PACKAGE_RANKS[p.id] || 0));
  };

  const isValidUpgrade = (pkgId) => {
    const rank = PACKAGE_RANKS[pkgId];
    const ownedRanks = userData.userPackages.map((p) => PACKAGE_RANKS[p.id]);
    const highestOwned = Math.max(...ownedRanks);

    return (
      !ownedRanks.includes(rank) && // Not already owned
      rank > highestOwned && // Only allow upgrades
      pkgId !== 1 // Cannot downgrade to Non-Res (ID 1)
    );
  };

  const handleUpgrade = (pkgId) => {
    // Trigger the upgrade logic here, e.g., calling an API
    alert(`Upgrade to package ${pkgId} initiated.`);
  };

  return (
    <div
      style={{
        padding: '40px',
        background: '#1C1C1E',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2>Upgrade Your Package</h2>
      <input
        type="text"
        placeholder="Enter email or phone"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={inputStyle}
      />
      <br />
      <button onClick={fetchUserPackages} style={upgradeBtn}>
        Search
      </button>

      {loading && <div style={loadingStyle}>Loading...</div>}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {userData && (
        <div style={{ marginTop: '40px', width: '100%', maxWidth: '800px' }}>
          <h3>User: {userData.user.first_name}</h3>
          <h4>Current Packages:</h4>
          {userData.userPackages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                ...cardStyle,
                ...cardHoverStyle,
              }}
            >
              <strong>{pkg.name}</strong> — ₹{pkg.price}
            </div>
          ))}

          <h4>Available Upgrades:</h4>
          {userData.allPackages.map((pkg) => {
            const owns = userData.userPackages.find((p) => p.id === pkg.id);
            const disabled = !isValidUpgrade(pkg.id);

            return (
              <div
                key={pkg.id}
                style={{
                  ...cardStyle,
                  ...cardHoverStyle,
                }}
              >
                <strong>{pkg.name}</strong> — ₹{pkg.price}
                <br />
                <button
                  style={disabled ? disabledBtn : upgradeBtn}
                  disabled={disabled}
                  onClick={() => !disabled && handleUpgrade(pkg.id)}
                >
                  {owns ? 'Already Owned' : disabled ? 'Not Eligible' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpgradePackagesPage;
