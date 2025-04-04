import React, { useState } from "react";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import "./KisarCart.css";

const Cart = ({ packages, onClose, onConfirm }) => {
  const [selectedMainPackageId, setSelectedMainPackageId] = useState(null);
  const [selectedAddonPackageId, setSelectedAddonPackageId] = useState(null);
  const [selectedWorkshopPackageIds, setSelectedWorkshopPackageIds] = useState([]);
  const [warning, setWarning] = useState(null); // Add state for warning message

  const handleMainPackageToggle = (pkgId) => {
    setSelectedMainPackageId((prev) => (prev === pkgId ? null : pkgId));
    setSelectedAddonPackageId(null);
    setSelectedWorkshopPackageIds([]);
    setWarning(null); // Reset warning when main package changes
  };

  const handleAddonPackageToggle = (pkgId) => {
    if (!selectedMainPackageId) return;
    setSelectedAddonPackageId((prev) => (prev === pkgId ? null : pkgId));
  };

  const handleWorkshopPackageToggle = (pkgId) => {
    if (!selectedMainPackageId) return;

    const selectedPkg = packages.find((p) => p.id === pkgId);
    const isPaid = parseFloat(selectedPkg.price) > 0;
    const currentPaidPackages = selectedWorkshopPackageIds
      .map((id) => packages.find((p) => p.id === id))
      .filter((p) => parseFloat(p.price) > 0);

    setSelectedWorkshopPackageIds((prev) => {
      // If package is already selected, remove it
      if (prev.includes(pkgId)) {
        setWarning(null); // Clear warning when deselecting
        return prev.filter((id) => id !== pkgId);
      }

      // If trying to add a paid package when one already exists
      if (isPaid && currentPaidPackages.length > 0) {
        setWarning("You can only select one paid workshop");
        return prev;
      }

      // Add the new package (either free or first paid package)
      setWarning(null);
      return [...prev, pkgId];
    });
  };

  const filteredPackages = packages.filter((pkg) => pkg.active === 1);
  const mainPackages = filteredPackages.filter((pkg) => pkg.type === "MAIN");
  const addonPackages = filteredPackages.filter((pkg) => pkg.type === "ADDON");
  const workshopPackages = filteredPackages.filter((pkg) => pkg.type === "WORKSHOP");

  const totalPrice = [
    selectedMainPackageId,
    selectedAddonPackageId,
    ...selectedWorkshopPackageIds,
  ]
    .filter(Boolean)
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
                      <span style={{ fontSize: "14px", color: "#555", display: "block", marginTop: "4px", fontWeight: "100" }}>
                        {pkg.description}
                      </span>
                    </span>
                    <button
                      className={`toggle-btn__Cart__modal ${selectedMainPackageId === pkg.id ? "selected" : ""}`}
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
                      <span style={{ fontSize: "14px", color: "#555", display: "block", marginTop: "4px", fontWeight: "100" }}>
                        {pkg.description}
                      </span>
                    </span>
                    <button
                      className={`toggle-btn__Cart__modal ${selectedAddonPackageId === pkg.id ? "selected" : ""} ${!selectedMainPackageId ? "disabled" : ""}`}
                      onClick={() => handleAddonPackageToggle(pkg.id)}
                      disabled={!selectedMainPackageId}
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

          {/* Workshop Packages Section */}
          <div className="package-section__Cart__modal">
            <h4 className="section-title__Cart__modal">Workshop Packages (Select Multiple - Optional, One Paid Max)</h4>
            <div className="package-list__Cart__modal">
              {workshopPackages.length > 0 ? (
                workshopPackages.map((pkg) => (
                  <div key={pkg.id} className="package-item__Cart__modal">
                    <span className="package-name__Cart__modal">
                      {pkg.name} - ₹{pkg.price}
                      <span style={{ fontSize: "14px", color: "#555", display: "block", marginTop: "4px", fontWeight: "100" }}>
                        {pkg.description}
                      </span>
                    </span>
                    <button
                      className={`toggle-btn__Cart__modal ${selectedWorkshopPackageIds.includes(pkg.id) ? "selected" : ""} ${!selectedMainPackageId ? "disabled" : ""}`}
                      onClick={() => handleWorkshopPackageToggle(pkg.id)}
                      disabled={!selectedMainPackageId}
                    >
                      {selectedWorkshopPackageIds.includes(pkg.id) ? <FaMinus /> : <FaPlus />}
                    </button>
                  </div>
                ))
              ) : (
                <p>No workshop packages available</p>
              )}
            </div>
            {warning && (
              <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>{warning}</p>
            )}
          </div>
        </div>

        <h4 className="total-price__Cart__modal">Total: ₹{totalPrice.toFixed(2)}</h4>

        <div className="cart-buttons__Cart__modal">
          <button className="cancel-btn__Cart__modal" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-btn__Cart__modal"
            onClick={() =>
              onConfirm(
                [selectedMainPackageId, selectedAddonPackageId, ...selectedWorkshopPackageIds].filter(Boolean)
              )
            }
            disabled={!selectedMainPackageId}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;