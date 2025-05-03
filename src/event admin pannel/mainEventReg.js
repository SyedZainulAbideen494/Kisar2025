import React, { useEffect, useState } from "react";
import axios from "axios";
import './MainEventRegApp.css';
import { Link } from "react-router-dom";  // import Link
import { API_ROUTES } from "../app modules/apiRoutes";

function MainEventRegApp() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");  // State to store the search query

  useEffect(() => {
    axios.get(`${API_ROUTES.baseUrl}/api/registrations/event-admin`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleLogin = async (id) => {
    await axios.post(`${API_ROUTES.baseUrl}/api/logins/event-admin`, { registration_id: id });
    alert("Logged in successfully");
  };

  const handleDetails = async (id) => {
    const res = await axios.get(`${API_ROUTES.baseUrl}/api/registrations/event-admin/${id}`);
    setSelected(res.data);
  };

    // Function to handle the search filter
    const filteredUsers = users.filter((user) => {
        return (
          user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

  return (
    <div className="container__Event__main__Admin">
       {/* Navbar */}
       <div className="navbar__Event__main__Admin">
        <div className="navLogo__Event__main__Admin">Event Admin</div>
        <div className="navLinks__Event__main__Admin">
          <Link to="/event/admin/main" className="navLink__Event__main__Admin navActive__Event__main__Admin">Home</Link>
          <Link to="/event/admin/session" className="navLink__Event__main__Admin">Sessions</Link>
                    <Link to="/event/admin/add-registration" className="navLink__Event__main__Admin">Add Registration</Link>
        
        </div>
      </div>
      <h2 className="heading__Event__main__Admin">Event Admin Panel</h2>
       {/* Search Bar */}
       <div className="searchBar__Event__main__Admin">
        <input
          type="text"
          placeholder="Search by phone or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="searchInput__Event__main__Admin"
        />
      </div>
      <div className="tableWrapper__Event__main__Admin">
        <table className="table__Event__main__Admin">
          <thead className="thead__Event__main__Admin">
            <tr className="tr__Event__main__Admin">
              <th className="th__Event__main__Admin">Name</th>
              <th className="th__Event__main__Admin">Email</th>
              <th className="th__Event__main__Admin">Phone</th>
              <th className="th__Event__main__Admin">Buttons</th>
            </tr>
          </thead>
          <tbody className="tbody__Event__main__Admin">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="tr__Event__main__Admin">
                <td className="td__Event__main__Admin">{u.first_name} {u.last_name}</td>
                <td className="td__Event__main__Admin">{u.email}</td>
                <td className="td__Event__main__Admin">{u.phone}</td>
                <td className="td__Event__main__Admin">
                  <button className="btn__Event__main__Admin" onClick={() => handleDetails(u.id)}>Details</button>
                  <button className="btn__Event__main__Admin" onClick={() => handleLogin(u.id)}>Login</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {selected && (
        <div className="modal__Event__main__Admin">
          <h3 className="modalHeading__Event__main__Admin">Details</h3>
          <p className="modalText__Event__main__Admin"><strong>Name:</strong> {selected.honorific} {selected.first_name} {selected.middle_name} {selected.last_name}</p>
          <p className="modalText__Event__main__Admin"><strong>Email:</strong> {selected.email}</p>
          <p className="modalText__Event__main__Admin"><strong>Phone:</strong> {selected.phone}</p>
          <p className="modalText__Event__main__Admin"><strong>Address:</strong> {selected.address}, {selected.city}, {selected.state} - {selected.pincode}</p>
          <p className="modalText__Event__main__Admin"><strong>Category:</strong> {selected.category}</p>
          <p className="modalText__Event__main__Admin"><strong>Type:</strong> {selected.type}</p>
          <button className="modalCloseBtn__Event__main__Admin" onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
  
}

export default MainEventRegApp;
