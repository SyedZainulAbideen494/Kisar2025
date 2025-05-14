import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";
import { API_ROUTES } from "../app modules/apiRoutes";
import { Link } from "react-router-dom";
import PackageList from "./PackageList";
import PackageModal from "./PackageList";
import * as XLSX from 'xlsx';
import { QRCodeCanvas } from 'qrcode.react';
import { FaQrcode } from 'react-icons/fa';

function AdminPanel() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("success");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [honorificFilter, setHonorificFilter] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [qrCodeUser, setQrCodeUser] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, [searchTerm, paymentStatus]);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(`${API_ROUTES.baseUrl}/api/registrations`, {
        params: { search: searchTerm, payment_status: paymentStatus },
      });
      setRegistrations(response.data);
      setTotalResults(response.data.length);
      const total = response.data.reduce((acc, user) => acc + parseFloat(user.amount || 0), 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const fileName = 'registrations.xlsx';
    const flattenedData = registrations.map(user => ({
      ID: user.id,
      Honorific: user.honorific,
      FirstName: user.first_name,
      MiddleName: user.middle_name,
      LastName: user.last_name,
      Email: user.email,
      Phone: user.phone,
      Address: user.address,
      City: user.city,
      State: user.state,
      Pincode: user.pincode,
      MedCouncilNo: user.med_council_number,
      Category: user.category,
      Type: user.type,
      Packages: user.package_names.join(', '),
      PaymentID: user.payment_id,
      PaymentStatus: user.payment_status,
      Amount: user.amount,
      Currency: user.currency,
      PaymentDate: new Date(user.payment_date).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: true
      }),
    }));
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils

.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, fileName);
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user, payment_date: user.payment_date.split(" ")[0] });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_ROUTES.baseUrl}/api/registrations/remove/${id}`);
        fetchRegistrations();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      const formattedUser = {
        ...editingUser,
        payment_date: editingUser.payment_date ? new Date(editingUser.payment_date).toISOString().slice(0, 19).replace("T", " ") : null,
      };
      await axios.put(`${API_ROUTES.baseUrl}/api/registrations/edit/${editingUser.id}`, formattedUser);
      setEditingUser(null);
      fetchRegistrations();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleQrCodeClick = (user) => {
    setQrCodeUser(user);
  };

  return (
    <div className="admin-layout__admin__page">
      <h2 className="admin-title__admin__page">Admin Panel - Event Registrations</h2>
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
        <Link
          to="/admin/packages"
          style={{
            display: "inline-block",
            padding: "10px 15px",
            backgroundColor: "#0078ff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "9px",
            textAlign: "center",
            transition: "background-color 0.3s ease",
          }}
        >
          + Add Packages
        </Link>
        <PackageModal totalRegistrations={totalResults} totalAmount={totalAmount} />
        <button
          onClick={handleExportToExcel}
          style={{
            display: "inline-block",
            padding: "10px 15px",
            backgroundColor: "#0078ff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "9px",
            textAlign: "center",
            transition: "background-color 0.3s ease",
          }}
          disabled={registrations.length === 0}
        >
          Export to Excel
        </button>
      </div>
      <div className="results-info">
        <p><strong>Total registrations = {totalResults}</strong></p>
        <p><strong>Total Amount Paid = ₹{totalAmount.toFixed(2)}</strong></p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Honorific</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Pincode</th>
              <th>Med Council No.</th>
              <th>Category</th>
              <th>Type</th>
              <th>Package</th>
              <th>Payment ID</th>
              <th>Payment Status</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length > 0 ? (
              registrations.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.honorific}</td>
                  <td>{user.first_name}</td>
                  <td>{user.middle_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>{user.city}</td>
                  <td>{user.state}</td>
                  <td>{user.pincode}</td>
                  <td>{user.med_council_number}</td>
                  <td>{user.category}</td>
                  <td>{user.type}</td>
                  <td>{user.package_names.join(', ')}</td>
                  <td>{user.payment_id}</td>
                  <td>{user.payment_status}</td>
                  <td>{user.amount}</td>
                  <td>{user.currency}</td>
                  <td>{new Date(user.payment_date).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                      <button
                        onClick={() => handleEditClick(user)}
                        style={{
                          width: "100px",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "14px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "#0078ff",
                          color: "white"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          width: "100px",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "14px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "#ff4d4d",
                          color: "white"
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleQrCodeClick(user)}
                        style={{
                          width: "100px",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "14px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "#28a745",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px"
                        }}
                      >
                        <FaQrcode /> QR Code
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="21" className="no-data__admin__page">No Registrations Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Edit User</h3>
            <select
              value={editingUser.honorific}
              onChange={(e) => setEditingUser({ ...editingUser, honorific: e.target.value })}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "5px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
            </select>
            <input type="text" value={editingUser.first_name} onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })} placeholder="First Name" />
            <input type="text" value={editingUser.middle_name} onChange={(e) => setEditingUser({ ...editingUser, middle_name: e.target.value })} placeholder="Middle Name (Optional)" />
            <input type="text" value={editingUser.last_name} onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })} placeholder="Last Name" />
            <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} placeholder="Email" />
            <input type="text" value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} placeholder="Phone" />
            <input type="text" value={editingUser.address} onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} placeholder="Address" />
            <input type="text" value={editingUser.city} onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })} placeholder="City" />
            <input type="text" value={editingUser.state} onChange={(e) => setEditingUser({ ...editingUser, state: e.target.value })} placeholder="State" />
            <input type="text" value={editingUser.pincode} onChange={(e) => setEditingUser({ ...editingUser, pincode: e.target.value })} placeholder="Pincode" />
            <input type="text" value={editingUser.med_council_number} onChange={(e) => setEditingUser({ ...editingUser, med_council_number: e.target.value })} placeholder="Medical Council Number (If applicable)" />
            <select
              value={editingUser.category}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "5px",
                outline: "none",
                cursor: "pointer",
              }}
              onChange={(e) => setEditingUser({ ...editingUser, category: e.target.value })}
            >
              <option value="Doctor">Doctor</option>
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
            </select>
            <select
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "5px",
                outline: "none",
                cursor: "pointer",
              }}
              value={editingUser.type}
              onChange={(e) => setEditingUser({ ...editingUser, type: e.target.value })}
            >
              <option value="DELEGATE">Delegate</option>
              <option value="FACULTY">Faculty</option>
            </select>
            <input type="text" value={editingUser.package_ids} onChange={(e) => setEditingUser({ ...editingUser, package_ids: e.target.value })} placeholder="Package IDs (Comma-separated)" />
            <input type="text" value={editingUser.payment_id} onChange={(e) => setEditingUser({ ...editingUser, payment_id: e.target.value })} placeholder="Payment ID" />
            <select
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "5px",
                outline: "none",
                cursor: "pointer",
              }}
              value={editingUser.payment_status}
              onChange={(e) => setEditingUser({ ...editingUser, payment_status: e.target.value })}
            >
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <input type="number" value={editingUser.amount} onChange={(e) => setEditingUser({ ...editingUser, amount: e.target.value })} placeholder="Amount" />
            <input type="text" value={editingUser.currency} onChange={(e) => setEditingUser({ ...editingUser, currency: e.target.value })} placeholder="Currency (e.g., INR, USD)" />
            <input type="date" value={editingUser.payment_date} onChange={(e) => setEditingUser({ ...editingUser, payment_date: e.target.value })} />
            <div className="modal-buttons">
              <button onClick={handleUpdateUser} className="save-btn">Save</button>
              <button onClick={() => setEditingUser(null)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {qrCodeUser && (
        <div className="modal-overlay">
          <div className="edit-modal" style={{ textAlign: "center", padding: "20px", maxWidth: "320px", margin: "auto" }}>
            <h3>Payment ID QR Code</h3>
            <p>Payment ID: {qrCodeUser.payment_id}</p>
            <div className="qr-container">
              <QRCodeCanvas value={qrCodeUser.payment_id} size={200} />
            </div>
            <div className="modal-buttons" style={{ marginTop: "20px" }}>
              <button
                onClick={() => setQrCodeUser(null)}
                className="cancel-btn"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;