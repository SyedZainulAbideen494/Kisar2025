import React, { useState, useEffect } from 'react';
import { API_ROUTES } from '../app modules/apiRoutes';

// Modal styles
const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)', // Darker backdrop
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalStyle = {
  background: '#1C1C1E', // Dark modal background (Apple dark mode style)
  color: 'white',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '500px',
  padding: '30px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  animation: 'fadeIn 0.3s ease',
  position: 'relative',
  maxHeight: '80vh', // Limit height
  overflowY: 'auto', // Enable scroll inside modal
};

const closeButtonStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: 'transparent',
  border: 'none',
  fontSize: '28px',
  cursor: 'pointer',
  color: '#aaa',
};

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  borderRadius: '10px',
  border: 'none',
  background: '#0A84FF', // Brighter blue
  color: 'white',
  cursor: 'pointer',
  transition: 'background 0.3s',
};

const listItemStyle = {
  background: '#2C2C2E', // Darker card inside
  borderRadius: '12px',
  padding: '15px',
  marginBottom: '15px',
  textAlign: 'center',
};

const titleStyle = {
  marginBottom: '20px',
  fontWeight: '600',
  fontSize: '22px',
  textAlign: 'center',
};

const PackageModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [packages, setPackages] = useState([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_ROUTES.baseUrl}/api/packages/reg-count`)
        .then(response => response.json())
        .then(data => {
          setPackages(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [isOpen]);

  return (
    <>
      {/* Button to open modal */}
      <button style={buttonStyle} onClick={openModal}>
        View Packages
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={backdropStyle}>
          <div style={modalStyle}>
            <button style={closeButtonStyle} onClick={closeModal}>
              &times;
            </button>
            <h2 style={titleStyle}>Packages & Registrations</h2>

            {packages.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
            ) : (
              packages.map(pkg => (
                <div key={pkg.id} style={listItemStyle}>
                  <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{pkg.name}</h3>
                  <p style={{ color: '#bbb' }}>Registrations: <strong style={{ color: 'white' }}>{pkg.reg_count}</strong></p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PackageModal;
