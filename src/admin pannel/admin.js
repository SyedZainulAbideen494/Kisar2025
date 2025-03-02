import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

function AdminPanel() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [editingUser, setEditingUser] = useState(null); // Store user being edited

  useEffect(() => {
    fetchRegistrations();
  }, [searchTerm, paymentStatus]);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/registrations", {
        params: { search: searchTerm, payment_status: paymentStatus },
      });
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (user) => {
    setEditingUser({ ...user, payment_date: user.payment_date.split(" ")[0] }); // Format date
  };

  // Handle Delete User
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/registrations/remove/${id}`);
        fetchRegistrations(); // Refresh list
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Handle Update User
  const handleUpdateUser = async () => {
    try {
      // Convert date to MySQL-compatible format
      const formattedUser = {
        ...editingUser,
        payment_date: new Date(editingUser.payment_date).toISOString().slice(0, 19).replace("T", " "),
      };

      await axios.put(`http://localhost:5000/api/registrations/edit/${editingUser.id}`, formattedUser);
      setEditingUser(null); // Close modal after saving
      fetchRegistrations(); // Refresh list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="admin-layout__admin__page">
      <h2 className="admin-title__admin__page">Admin Panel - Event Registrations</h2>

      {/* Search & Filter Section */}
      <div className="search-filters__admin__page">
        <input
          type="text"
          placeholder="Search by name, email, phone, or payment ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input__admin__page"
        />

        <select
          className="filter-select__admin__page"
          onChange={(e) => setPaymentStatus(e.target.value)}
          value={paymentStatus}
        >
          <option value="">All Payments</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="custom-table__admin__page">
        {loading ? (
          <div className="loading-spinner__admin__page">Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Payment ID</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length > 0 ? (
                registrations.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.payment_id}</td>
                    <td>{user.payment_status}</td>
                    <td>{user.payment_date}</td>
                    <td>
                      <button onClick={() => handleEditClick(user)} className="edit-btn__admin">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="delete-btn__admin">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data__admin__page">No Registrations Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Edit User</h3>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="text"
              value={editingUser.phone}
              onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
              placeholder="Phone"
            />
            <input
              type="text"
              value={editingUser.payment_id}
              onChange={(e) => setEditingUser({ ...editingUser, payment_id: e.target.value })}
              placeholder="Payment ID"
            />
            <select
              value={editingUser.payment_status}
              onChange={(e) => setEditingUser({ ...editingUser, payment_status: e.target.value })}
            >
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <input
              type="date"
              value={editingUser.payment_date}
              onChange={(e) => setEditingUser({ ...editingUser, payment_date: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={handleUpdateUser} className="save-btn">Save</button>
              <button onClick={() => setEditingUser(null)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
