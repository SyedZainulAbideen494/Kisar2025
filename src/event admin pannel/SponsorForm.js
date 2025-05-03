import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SponsorPage.css"; // Optional styling
import { Link } from "react-router-dom";
import { API_ROUTES } from "../app modules/apiRoutes";

function SponsorPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
  });

  const [sponsors, setSponsors] = useState([]);

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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_ROUTES.baseUrl}/api/sponsors/register`, formData);
      alert("Sponsor registered!");
      setFormData({ name: "", phone: "", email: "", organization: "" });
      fetchSponsors(); // refresh the list
    } catch (err) {
      alert("Registration failed.");
    }
  };

  return (
    <div className="sponsor__container">
          {/* Navbar */}
       <div className="navbar__Event__main__Admin">
        <div className="navLogo__Event__main__Admin">Event Admin</div>
        <div className="navLinks__Event__main__Admin">
          <Link to="/event/admin/main" className="navLink__Event__main__Admin">Home</Link>
          <Link to="/event/admin/session" className="navLink__Event__main__Admin">Sessions</Link>
                    <Link to="/event/admin/add-registration" className="navLink__Event__main__Admin">Add Registration</Link>
                            <Link to="/event/admin/analytics" className="navLink__Event__main__Admin">Event Analytics</Link>
                            <Link to="/event/admin/sponsor" className="navLink__Event__main__Admin navActive__Event__main__Admin">Add Sponsor</Link>

        </div>
      </div>
    <h2>Register Event Sponsor</h2>
    <form onSubmit={handleSubmit} className="sponsor__form">
      <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
      <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
      <input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
      <input name="organization" placeholder="Organization (optional)" value={formData.organization} onChange={handleChange} />
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
        </tr>
      </thead>
      <tbody>
        {sponsors.map((s, idx) => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.phone}</td>
            <td>{s.email}</td>
            <td>{s.organization || '—'}</td>
            <td>{new Date(s.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  );
}

export default SponsorPage;
