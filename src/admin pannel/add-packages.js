import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

function AdminPanelPackages() {
  const [packages, setPackages] = useState([]); // Packages list
  const [newPackage, setNewPackage] = useState({ name: "", description: "", price: "" });
  const [showPackageModal, setShowPackageModal] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/packages");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.name || !newPackage.price) {
      alert("Package name and price are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/packages/add", newPackage);
      setNewPackage({ name: "", description: "", price: "" });
      setShowPackageModal(false);
      fetchPackages(); // Refresh list
    } catch (error) {
      console.error("Error adding package:", error);
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`http://localhost:5000/api/packages/remove/${id}`);
        fetchPackages();
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  return (
    <div className="admin-layout__admin__page">
      <h2 className="admin-title__admin__page">Admin Panel - Packages</h2>

      {/* Add New Package Button */}
      <button onClick={() => setShowPackageModal(true)} className="add-package-btn">
        Add New Package
      </button>

      {/* Packages Table */}
      <div className="custom-table__admin__page">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Package Name</th>
              <th>Description</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.id}</td>
                  <td>{pkg.name}</td>
                  <td>{pkg.description || "N/A"}</td>
                  <td>₹{pkg.price}</td>
                  <td>
                    <button onClick={() => handleDeletePackage(pkg.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data__admin__page">No Packages Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Package Modal */}
      {showPackageModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Add New Package</h3>
            <input
              type="text"
              value={newPackage.name}
              onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
              placeholder="Package Name"
            />
            <input
              type="text"
              value={newPackage.description}
              onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
              placeholder="Description (Optional)"
            />
            <input
              type="number"
              value={newPackage.price}
              onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
              placeholder="Price (₹)"
            />
            <div className="modal-buttons">
              <button onClick={handleAddPackage} className="save-btn">Add Package</button>
              <button onClick={() => setShowPackageModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanelPackages;
