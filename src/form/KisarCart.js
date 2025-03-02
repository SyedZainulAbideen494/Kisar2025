import React, { useState } from "react";
import "./KisarCart.css";

const Cart = ({ packages, onClose, onConfirm }) => {
  const [selectedPackages, setSelectedPackages] = useState({});

  const handleAddPackage = (pkg) => {
    setSelectedPackages((prev) => ({
      ...prev,
      [pkg]: prev[pkg] ? prev[pkg] + 1 : 1,
    }));
  };

  const handleRemovePackage = (pkg) => {
    setSelectedPackages((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[pkg] > 1) {
        updatedCart[pkg] -= 1;
      } else {
        delete updatedCart[pkg];
      }
      return updatedCart;
    });
  };

  const totalPrice = Object.keys(selectedPackages).reduce(
    (total, pkg) => total + selectedPackages[pkg] * packages[pkg],
    0
  );

  return (
    <div className="cart__Cart__modal">
      <div className="cart-content__Cart__modal">
        <h3 className="cart-title__Cart__modal">Select Packages</h3>

        <div className="package-list__Cart__modal">
          {Object.keys(packages).map((pkg) => (
            <div key={pkg} className="package-item__Cart__modal">
              <span className="package-name__Cart__modal">
                {pkg.charAt(0).toUpperCase() + pkg.slice(1)} - ₹{packages[pkg]}
              </span>
              <button className="add-btn__Cart__modal" onClick={() => handleAddPackage(pkg)}>+</button>
              <span className="package-quantity__Cart__modal">{selectedPackages[pkg] || 0}</span>
              <button className="remove-btn__Cart__modal" onClick={() => handleRemovePackage(pkg)} disabled={!selectedPackages[pkg]}>-</button>
            </div>
          ))}
        </div>

        <h4 className="total-price__Cart__modal">Total: ₹{totalPrice}</h4>

        <div className="cart-buttons__Cart__modal">
          <button className="cancel-btn__Cart__modal" onClick={onClose}>Cancel</button>
          <button className="confirm-btn__Cart__modal" onClick={() => onConfirm(selectedPackages)}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
