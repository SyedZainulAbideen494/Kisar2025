import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SponsorPage.css";
import { Link } from "react-router-dom";
import { API_ROUTES } from "../app modules/apiRoutes";
import { QRCodeCanvas } from "qrcode.react";
import { FaQrcode } from "react-icons/fa";

function SponsorPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
  });

  const [sponsors, setSponsors] = useState([]);
  const [qrDialogSponsor, setQrDialogSponsor] = useState(null);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await axios.get(`${API_ROUTES.baseUrl}/api/sponsors`);
      setSponsors(res.data);
    } catch (err) {
      alert("Error fetching sponsors");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_ROUTES.baseUrl}/api/sponsors/register`, formData);
      alert("Sponsor registered!");
      setFormData({ name: "", phone: "", email: "", organization: "" });
      fetchSponsors();
    } catch (err) {
      alert("Registration failed.");
    }
  };

  const openQrDialog = (sponsor) => {
    setQrDialogSponsor(sponsor);
  };

  const closeQrDialog = () => {
    setQrDialogSponsor(null);
  };

  return (
    <div className="sponsor__container">
      <div className="navbar__Event__main__Admin">
        <div className="navLogo__Event__main__Admin">Event Admin</div>
        <div className="navLinks__Event__main__Admin">
          <Link to="/event/admin/main" className="navLink__Event__main__Admin">
            Home
          </Link>
          <Link to="/event/admin/session" className="navLink__Event__main__Admin">
            Sessions
          </Link>
          <Link
            to="/event/admin/add-registration"
            className="navLink__Event__main__Admin"
          >
            Add Registration
          </Link>
          <Link
            to="/event/admin/analytics"
            className="navLink__Event__main__Admin"
          >
            Event Analytics
          </Link>
          <Link
            to="/event/admin/sponsor"
            className="navLink__Event__main__Admin navActive__Event__main__Admin"
          >
            Add Sponsor
          </Link>
        </div>
      </div>

      <h2>Register Event Sponsor</h2>
      <form onSubmit={handleSubmit} className="sponsor__form">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="organization"
          placeholder="Organization (optional)"
          value={formData.organization}
          onChange={handleChange}
        />
        <div className="sponsor__form__actions">
          <button type="submit">Register Sponsor</button>
        </div>
      </form>

      <h3>Registered Sponsors</h3>
      <table className="sponsor__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Registered On</th>
            <th>QR Code</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.length > 0 ? (
            sponsors.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.email}</td>
                <td>{s.organization || "—"}</td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
                <td>
                  {s.reference_id ? (
                    <button
                      onClick={() => openQrDialog(s)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      aria-label={`Show QR code for ${s.name}`}
                      title="Show QR code"
                    >
                      <FaQrcode size={24} color="#0078ff" />
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No sponsors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {qrDialogSponsor && (
        <div className="modal-overlay">
          <div
            className="edit-modal"
            style={{
              textAlign: "center",
              padding: "20px",
              maxWidth: "320px",
              margin: "auto",
            }}
          >
            <h3>QR Code for {qrDialogSponsor.name}</h3>
            <p>Reference ID: {qrDialogSponsor.reference_id}</p>
            <div className="qr-container">
              <QRCodeCanvas value={qrDialogSponsor.reference_id} size={200} />
            </div>
            <div className="modal-buttons" style={{ marginTop: "20px" }}>
              <button
                onClick={closeQrDialog}
                className="cancel-btn"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "white",
                  color: "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
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

export default SponsorPage;