import React, { useState } from "react";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import "./KisarCart.css";

const Cart = ({ packages, onClose, onConfirm }) => {
  const [selectedMainPackageId, setSelectedMainPackageId] = useState(null); // Single Main package ID
  const [selectedAddonPackageId, setSelectedAddonPackageId] = useState(null); // Single Addon package ID

  const handleMainPackageToggle = (pkgId) => {
    setSelectedMainPackageId((prev) => (prev === pkgId ? null : pkgId)); // Toggle or select new
  };

  const handleAddonPackageToggle = (pkgId) => {
    if (!selectedMainPackageId) return; // Disable Addon selection without Main
    setSelectedAddonPackageId((prev) => (prev === pkgId ? null : pkgId)); // Toggle or select new
  };
  console.log("packages",packages)
  const filteredPackages = packages.filter((pkg) => pkg.active === 1);
  const mainPackages = filteredPackages.filter((pkg) => pkg.type === "MAIN");
  const addonPackages = filteredPackages.filter((pkg) => pkg.type === "ADDON");

  const totalPrice = [selectedMainPackageId, selectedAddonPackageId]
    .filter(Boolean) // Remove nulls
    .reduce((total, pkgId) => {
      const pkg = filteredPackages.find((p) => p.id === pkgId);
      return total + (pkg ? parseFloat(pkg.price) : 0);
    }, 0);

  return (
    <div className="cart__Cart__modal">
      <div className="cart-content__Cart__modal">
        <h3 className="cart-title__Cart__modal">
          <FaShoppingCart className="cart-icon" /> Your Cart
        </h3>

        <div className="cart-sections__Cart__modal">
          {/* Main Packages Section */}
          <div className="package-section__Cart__modal">
            <h4 className="section-title__Cart__modal">Main Packages (Select One - Mandatory)</h4>
            <div className="package-list__Cart__modal">
              {mainPackages.length > 0 ? (
                mainPackages.map((pkg) => (
                  <div key={pkg.id} className="package-item__Cart__modal">
                    <span className="package-name__Cart__modal">
                      {pkg.name} - ₹{pkg.price}
                    </span>
                    <button
                      className={`toggle-btn__Cart__modal ${
                        selectedMainPackageId === pkg.id ? "selected" : ""
                      }`}
                      onClick={() => handleMainPackageToggle(pkg.id)}
                    >
                      {selectedMainPackageId === pkg.id ? <FaMinus /> : <FaPlus />}
                    </button>
                  </div>
                ))
              ) : (
                <p>No main packages available</p>
              )}
            </div>
          </div>

          {/* Addon Packages Section */}
          <div className="package-section__Cart__modal">
            <h4 className="section-title__Cart__modal">Addon Packages (Select One - Optional)</h4>
            <div className="package-list__Cart__modal">
              {addonPackages.length > 0 ? (
                addonPackages.map((pkg) => (
                  <div key={pkg.id} className="package-item__Cart__modal">
                    <span className="package-name__Cart__modal">
                      {pkg.name} - ₹{pkg.price}
                    </span>
                    <button
                      className={`toggle-btn__Cart__modal ${
                        selectedAddonPackageId === pkg.id ? "selected" : ""
                      } ${!selectedMainPackageId ? "disabled" : ""}`}
                      onClick={() => handleAddonPackageToggle(pkg.id)}
                      disabled={!selectedMainPackageId} // Disable if no Main package selected
                    >
                      {selectedAddonPackageId === pkg.id ? <FaMinus /> : <FaPlus />}
                    </button>
                  </div>
                ))
              ) : (
                <p>No addon packages available</p>
              )}
            </div>
          </div>
        </div>

        <h4 className="total-price__Cart__modal">Total: ₹{totalPrice.toFixed(2)}</h4>

        <div className="cart-buttons__Cart__modal">
          <button className="cancel-btn__Cart__modal" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-btn__Cart__modal"
            onClick={() => onConfirm([selectedMainPackageId, selectedAddonPackageId].filter(Boolean))}
            disabled={!selectedMainPackageId} // Disable Confirm if no Main package
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;