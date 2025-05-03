import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./AnalyticsPage.css";
import { API_ROUTES } from "../app modules/apiRoutes";
import { Link } from "react-router-dom";

function AnalyticsPage() {
  const [logins, setLogins] = useState([]);

  useEffect(() => {
    fetchLogins();
  }, []);

  const fetchLogins = async () => {
    try {
      const res = await axios.get(`${API_ROUTES.baseUrl}/api/analytics/logins`);
      setLogins(res.data);
    } catch (err) {
      alert("Error fetching login data: " + err.message);
    }
  };

  const exportToExcel = () => {
    const formattedData = logins.map(log => ({
      Name: `${log.first_name} ${log.last_name}`,
      Honorific: log.honorific,
      Email: log.email,
      Phone: log.phone,
      City: log.city,
      "Login Time": new Date(log.login_time).toLocaleString(),
      Packages: log.package_names?.join(", ") || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logins");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(dataBlob, "event_logins.xlsx");
  };

  return (
    <div className="analytics__container">
         {/* Navbar */}
       <div className="navbar__Event__main__Admin">
        <div className="navLogo__Event__main__Admin">Event Admin</div>
        <div className="navLinks__Event__main__Admin">
          <Link to="/event/admin/main" className="navLink__Event__main__Admin">Home</Link>
          <Link to="/event/admin/session" className="navLink__Event__main__Admin">Sessions</Link>
                    <Link to="/event/admin/add-registration" className="navLink__Event__main__Admin">Add Registration</Link>
                    <Link to="/event/admin/analytics" className="navLink__Event__main__Admin navActive__Event__main__Admin">Event Analytics</Link>

        </div>
      </div>
      <h2>Event Login Analytics</h2>
      <button className="export__button" onClick={exportToExcel}>
        Export to Excel
      </button>
      <table className="analytics__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Honorific</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Login Time</th>
            <th>Packages</th>
          </tr>
        </thead>
        <tbody>
          {logins.map((log, idx) => (
            <tr key={idx}>
              <td>{log.first_name} {log.last_name}</td>
              <td>{log.honorific}</td>
              <td>{log.email}</td>
              <td>{log.phone}</td>
              <td>{log.city}</td>
              <td>{new Date(log.login_time).toLocaleString()}</td>
              <td>{log.package_names?.join(', ') || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AnalyticsPage;
