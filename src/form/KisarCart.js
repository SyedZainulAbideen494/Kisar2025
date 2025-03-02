import React, { useState } from "react";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import "./KisarCart.css";

const Cart = ({ packages, onClose, onConfirm }) => {
  const [selectedPackageIds, setSelectedPackageIds] = useState([]); // Array of selected package IDs

  const handleTogglePackage = (pkgId) => {
    setSelectedPackageIds((prev) => {
      if (prev.includes(pkgId)) {
        return prev.filter((id) => id !== pkgId); // Remove if already selected
      } else {
        return [...prev, pkgId]; // Add if not selected
      }
    });
  };

  const totalPrice = selectedPackageIds.reduce((total, pkgId) => {
    const pkg = packages.find((p) => p.id === pkgId);
    return total + (pkg ? parseFloat(pkg.price) : 0);
  }, 0);

  // Separate packages into Main and Addon
  const mainPackages = packages.filter((pkg) => pkg.type === "MAIN");
  const addonPackages = packages.filter((pkg) => pkg.type === "ADDON");

  return (
    <div className="cart__Cart__modal">
      <div className="cart-content__Cart__modal">
        <h3 className="cart-title__Cart__modal">
          <FaShoppingCart className="cart-icon" /> Your Cart
        </h3>

        <div className="cart-sections__Cart__modal">
          {/* Main Packages Section */}
          <div className="package-section__Cart__modal">
            <h4 className="section-title__Cart__modal">Main Packages</h4>
            <div className="package-list__Cart__modal">
              {mainPackages.length > 0 ? (
                mainPackages.map((pkg) => (
                  <div key={pkg.id} className="package-item__Cart__modal">
                    <span className="package-name__Cart__modal">
                      {pkg.name} - ₹{pkg.price}
                    </span>
                    <button
                      className={`toggle-btn__Cart__modal ${selectedPackageIds.includes(pkg.id) ? "selected" : ""}`}
                      onClick={() => handleTogglePackage(pkg.id)}
                    >
                      {selectedPackageIds.includes(pkg.id) ? (
                        <FaMinus />
                      ) : (
                        <FaPlus />
                      )}
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
            <h4 className="section-title__Cart__modal">Addon Packages</h4>
            <div className="package-list__Cart__modal">
              {addonPackages.length > 0 ? (
                addonPackages.map((pkg) => (
                  <div key={pkg.id} className="package-item__Cart__modal">
                    <span className="package-name__Cart__modal">
                      {pkg.name} - ₹{pkg.price}
                    </span>
                    <button
                      className={`toggle-btn__Cart__modal ${selectedPackageIds.includes(pkg.id) ? "selected" : ""}`}
                      onClick={() => handleTogglePackage(pkg.id)}
                    >
                      {selectedPackageIds.includes(pkg.id) ? (
                        <FaMinus />
                      ) : (
                        <FaPlus />
                      )}
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
            onClick={() => onConfirm(selectedPackageIds)}
            disabled={selectedPackageIds.length === 0}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;