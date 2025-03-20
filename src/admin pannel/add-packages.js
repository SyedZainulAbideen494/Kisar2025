import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";
import { API_ROUTES } from "../app modules/apiRoutes";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function AdminPanelPackages() {
  const [packages, setPackages] = useState([]); // Packages list
  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    price: "",
    active: true,
    type: "MAIN",
  });
  const [editPackage, setEditPackage] = useState(null); // State for editing package
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const nav = useNavigate()

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(API_ROUTES.packages);
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
      await axios.post(`${API_ROUTES.baseUrl}/api/packages/add`, newPackage);
      setNewPackage({ name: "", description: "", price: "", active: true, type: "MAIN" });
      setShowPackageModal(false);
      fetchPackages();
    } catch (error) {
      console.error("Error adding package:", error);
    }
  };

  const handleEditPackage = async () => {
    if (!editPackage.name || !editPackage.price) {
      alert("Package name and price are required.");
      return;
    }

    try {
      await axios.put(`${API_ROUTES.baseUrl}/api/packages/edit/${editPackage.id}`, editPackage);
      setEditPackage(null);
      setShowEditModal(false);
      fetchPackages();
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`${API_ROUTES.baseUrl}/api/packages/remove/${id}`);
        fetchPackages();
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  const openEditModal = (pkg) => {
    setEditPackage(pkg);
    setShowEditModal(true);
  };

  return (
    <div className="admin-layout__admin__page">
      <h2 className="admin-title__admin__page">Admin Panel - Packages</h2>
  {/* Add New Package Button */}
  <button onClick={() => nav('/admin')} className="add-package-btn"style={{marginRight: '5px'}}>
        <FaArrowLeft/>
      </button>
      {/* Add New Package Button */}
      <button onClick={() => setShowPackageModal(true)} className="add-package-btn" >
       + Add New Package
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
              <th>Type</th>
              <th>Active</th>
              <th>Created At</th>
              <th>Updated At</th>
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
                  <td>{pkg.type}</td>
                  <td>{pkg.active ? "Yes" : "No"}</td>
                  <td>{new Date(pkg.created_at).toLocaleString()}</td>
                  <td>{new Date(pkg.updated_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => openEditModal(pkg)} className="edit-btn__admin">Edit</button>
                    <button onClick={() => handleDeletePackage(pkg.id)} className="delete-btn" style={{border: 'none', marginTop: '5px'}}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data__admin__page">No Packages Available</td>
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
            <label>
              Active:
              <input
                type="checkbox"
                checked={newPackage.active}
                onChange={(e) => setNewPackage({ ...newPackage, active: e.target.checked })}
              />
            </label>
            <label style={{ color: "#fff", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
  Type:
  <select
    value={newPackage.type}
    onChange={(e) => setNewPackage({ ...newPackage, type: e.target.value })}
    style={{
      backgroundColor: "#333", // Dark background
      color: "#fff", // Light text
      border: "1px solid #555", // Subtle border
      padding: "8px",
      borderRadius: "4px",
      outline: "none",
      cursor: "pointer",
      fontSize: "16px",
      width: "100%",
      marginTop: "4px",
    }}
  >
    <option value="MAIN" style={{ backgroundColor: "#222", color: "#fff" }}>Main</option>
    <option value="ADDON" style={{ backgroundColor: "#222", color: "#fff" }}>Addon</option>
    <option value="WORKSHOP" style={{ backgroundColor: "#222", color: "#fff" }}>Workshop</option>
  </select>
</label>

            <div className="modal-buttons">
              <button onClick={handleAddPackage} className="save-btn">Add Package</button>
              <button onClick={() => setShowPackageModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditModal && editPackage && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Edit Package</h3>
            <input
              type="text"
              value={editPackage.name}
              onChange={(e) => setEditPackage({ ...editPackage, name: e.target.value })}
              placeholder="Package Name"
            />
            <input
              type="text"
              value={editPackage.description || ""}
              onChange={(e) => setEditPackage({ ...editPackage, description: e.target.value })}
              placeholder="Description (Optional)"
            />
            <input
              type="number"
              value={editPackage.price}
              onChange={(e) => setEditPackage({ ...editPackage, price: e.target.value })}
              placeholder="Price (₹)"
            />
            <label>
              Active:
              <input
                type="checkbox"
                checked={editPackage.active}
                onChange={(e) => setEditPackage({ ...editPackage, active: e.target.checked })}
              />
            </label>
            <label>
              Type:
              <select
                value={editPackage.type}
                onChange={(e) => setEditPackage({ ...editPackage, type: e.target.value })}
              >
                <option value="MAIN">Main</option>
                <option value="ADDON">Addon</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button onClick={handleEditPackage} className="save-btn">Save Changes</button>
              <button onClick={() => setShowEditModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanelPackages;