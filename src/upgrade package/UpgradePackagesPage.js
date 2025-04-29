import React, { useState } from 'react';
import { API_ROUTES } from '../app modules/apiRoutes';

// CSS styles defined inline for the component
const styles = `
  .container {
    min-height: 100vh;
    background: #1a1a1a;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    font-family: Arial, sans-serif;
  }

  .content {
    width: 100%;
    max-width: 900px;
  }

  .title {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .search-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid #444;
    background: #2a2a2a;
    color: #fff;
    font-size: 0.95rem;
    outline: none;
  }

  .search-input:focus {
    border-color: #1e90ff;
  }

  .search-input::placeholder {
    color: #888;
  }

  .search-button, .confirm-button, .cancel-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .search-button {
    background: #1e90ff;
    color: #fff;
  }

  .search-button:hover:not(:disabled) {
    background: #1c86ee;
  }

  .search-button:disabled {
    background: #555;
    cursor: not-allowed;
  }

  .error {
    background: #d32f2f;
    color: #fff;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 0.95rem;
  }

  .loading {
    text-align: center;
    padding: 1.5rem;
    color: #888;
  }

  .spinner {
    width: 2rem;
    height: 2rem;
    border: 4px solid #1e90ff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .section {
    background: #2a2a2a;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .user-details {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .user-details span {
    font-weight: 500;
  }

  .package-list, .upgrade-list {
    display: grid;
    gap: 0.75rem;
  }

  .package-item, .upgrade-item {
    background: #333;
    padding: 1rem;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s;
  }

  .package-item:hover, .upgrade-item:hover {
    background: #3a3a3a;
  }

  .package-info h4 {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .package-info p {
    color: #bbb;
    font-size: 0.85rem;
  }

  .package-status {
    color: #00ff00;
    font-size: 0.85rem;
  }

  .upgrade-button, .owned-button, .ineligible-button {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .upgrade-button {
    background: #1e90ff;
    color: #fff;
  }

  .upgrade-button:hover {
    background: #1c86ee;
  }

  .owned-button {
    background: #388e3c;
    color: #fff;
  }

  .ineligible-button {
    background: #555;
    color: #fff;
    cursor: not-allowed;
  }

  .no-packages {
    color: #888;
    font-size: 0.9rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: #2a2a2a;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    position: relative;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
  }

  .modal-content p {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .modal-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .confirm-button {
    background: #1e90ff;
    color: #fff;
  }

  .confirm-button:hover:not(:disabled) {
    background: #1c86ee;
  }

  .confirm-button:disabled {
    background: #555;
    cursor: not-allowed;
  }

  .cancel-button {
    background: #555;
    color: #fff;
  }

  .cancel-button:hover {
    background: #666;
  }

  @media (min-width: 640px) {
    .search-container {
      flex-direction: row;
    }

    .title {
      font-size: 2rem;
    }

    .user-details {
      grid-template-columns: 1fr 1fr;
    }

    .section {
      padding: 2rem;
    }

    .section-title {
      font-size: 1.75rem;
    }

    .package-info h4 {
      font-size: 1rem;
    }

    .package-info p, .package-status, .upgrade-button, .owned-button, .ineligible-button {
      font-size: 0.9rem;
    }

    .modal-buttons {
      flex-direction: row;
      justify-content: center;
    }

    .modal {
      padding: 2rem;
    }

    .modal-title {
      font-size: 1.75rem;
    }
  }
`;

// Inject CSS into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

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
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchUserPackages = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_ROUTES.baseUrl}/api/user-packages?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setUserData(null);
      } else {
        setUserData(data);
        setSelectedPackage(null);
      }
    } catch {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Derive userPackages from allPackages and package_ids
  const userPackages = userData?.user?.package_ids?.length && userData?.allPackages?.length
    ? userData.allPackages.filter(pkg => userData.user.package_ids.includes(pkg.id))
    : [];

  const getHighestOwnedRank = () => {
    if (!userPackages.length) return 0;
    return Math.max(...userPackages.map((p) => PACKAGE_RANKS[p.id] || 0));
  };

  const isValidUpgrade = (pkgId) => {
    const rank = PACKAGE_RANKS[pkgId];
    const ownedRanks = userPackages.map((p) => PACKAGE_RANKS[p.id]) || [];
    const highestOwned = Math.max(...ownedRanks, 0);
    return (
      !ownedRanks.includes(rank) &&
      rank > highestOwned &&
      pkgId !== 1
    );
  };

  const getDifferenceAmount = (pkgId) => {
    console.log("User data fetched", userData);
    const pkg = userData.allPackages.find((p) => p.id === pkgId);
    if (!pkg || !userData.user.amount || userData.user.fees === undefined) return 0;
    const adjustedCurrentAmount = parseFloat(userData.user.amount) - (parseFloat(userData.user.fees) + 0.18 * parseFloat(userData.user.fees));
    return pkg.price - adjustedCurrentAmount;
  };

  const handleUpgrade = async (pkgId) => {
    setLoading(true);
    try {
      const pkg = userData.allPackages.find((p) => p.id === pkgId);
      if (!pkg) {
        throw new Error('Selected package not found');
      }

      const differenceAmount = getDifferenceAmount(pkgId);
      if (differenceAmount <= 0) {
        throw new Error('Upgrade amount must be positive');
      }

      const response = await fetch(`${API_ROUTES.baseUrl}/api/create-upgrade-order-instamojo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_id: userData.user.id,
          package_id: pkgId,
          amount: differenceAmount,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Instamojo payment URL
      window.location.href = data.payment_request.url;
    } catch (err) {
      setError(err.message || 'Failed to process upgrade. Please try again.');
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  const closeModal = () => {
    setSelectedPackage(null);
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Upgrade Your Package</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by email or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button
            onClick={fetchUserPackages}
            disabled={loading}
            className="search-button"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {loading && !error && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {userData && (
          <div>
            <div className="section">
              <h2 className="section-title">User Details</h2>
              <div className="user-details">
                <p><span>Name:</span> {userData.user.honorific || ''} {userData.user.first_name} {userData.user.middle_name || ''} {userData.user.last_name || ''}</p>
                <p><span>Email:</span> {userData.user.email}</p>
                <p><span>Phone:</span> {userData.user.phone}</p>
              </div>
              <h3 className="section-title">Current Packages</h3>
              {userPackages.length ? (
                <div className="package-list">
                  {userPackages.map((pkg) => (
                    <div key={pkg.id} className="package-item">
                      <div className="package-info">
                        <h4>{pkg.name}</h4>
                        <p>₹{pkg.price.toLocaleString()}</p>
                      </div>
                      <span className="package-status">Active</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-packages">No main packages assigned.</p>
              )}
            </div>

            <div className="section">
              <h2 className="section-title">Available Upgrades</h2>
              {userData.allPackages?.length ? (
                <div className="upgrade-list">
                  {userData.allPackages.map((pkg) => {
                    const owns = userPackages.find((p) => p.id === pkg.id);
                    const disabled = !isValidUpgrade(pkg.id);
                    return (
                      <div key={pkg.id} className="upgrade-item">
                        <div className="package-info">
                          <h4>{pkg.name}</h4>
                          <p>₹{pkg.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => !disabled && !owns && setSelectedPackage(pkg.id)}
                          disabled={disabled || owns}
                          className={
                            owns ? 'owned-button' :
                            disabled ? 'ineligible-button' : 'upgrade-button'
                          }
                        >
                          {owns ? 'Currently Owned' : disabled ? 'Not Eligible' : 'Upgrade to this Package'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-packages">No main packages available for upgrade.</p>
              )}
            </div>
          </div>
        )}

        {selectedPackage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Confirm Upgrade</h2>
              <div className="modal-content">
                <p>
                  Upgrade to{' '}
                  <strong>{userData.allPackages.find((p) => p.id === selectedPackage)?.name || 'Unknown'}</strong> for{' '}
                  ₹{getDifferenceAmount(selectedPackage).toLocaleString() || '0'}.
                </p>
              </div>
              <div className="modal-buttons">
                <button
                  onClick={() => handleUpgrade(selectedPackage)}
                  disabled={loading}
                  className="confirm-button"
                >
                  {loading ? 'Processing...' : 'Confirm Upgrade'}
                </button>
                <button
                  onClick={closeModal}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradePackagesPage;