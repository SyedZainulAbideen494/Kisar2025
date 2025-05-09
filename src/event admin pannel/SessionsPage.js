import React, { useEffect, useState } from "react";
import axios from "axios";
import './SessionsPage.css';
import { API_ROUTES } from "../app modules/apiRoutes";
import { Link } from "react-router-dom";

function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [newSessionName, setNewSessionName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_ROUTES.baseUrl}/api/sessions`);
      setSessions(res.data);
    } catch (err) {
      alert("Error fetching sessions: " + err.message);
    }
  };

  const createSession = async () => {
    if (!newSessionName.trim()) return alert("Enter session name");
    try {
      await axios.post(`${API_ROUTES.baseUrl}/api/sessions`, { name: newSessionName });
      setNewSessionName("");
      fetchSessions();
    } catch (err) {
      alert("Error creating session: " + err.message);
    }
  };

  const endSession = async (id) => {
    try {
      await axios.post(`${API_ROUTES.baseUrl}/api/sessions/${id}/end`);
      fetchSessions();
    } catch (err) {
      alert("Error ending session: " + err.message);
    }
  };


  const showAttendees = async (session) => {
    try {
      const res = await axios.get(`${API_ROUTES.baseUrl}/api/sessions/${session.id}/attendees`);
      setAttendees({
        attendees: res.data.attendees || [],
        sponsors: res.data.sponsors || [],
      });
      setSelectedSession(session);
      setShowModal(true);
    } catch (err) {
      alert("Error fetching attendees: " + err.message);
    }
  };
  

  return (
    <div className="sessions__container__admin__page">
          {/* Navbar */}
       <div className="navbar__Event__main__Admin">
        <div className="navLogo__Event__main__Admin">Event Admin</div>
        <div className="navLinks__Event__main__Admin">
          <Link to="/event/admin/main" className="navLink__Event__main__Admin">Home</Link>
          <Link to="/event/admin/session" className="navLink__Event__main__Admin navActive__Event__main__Admin">Sessions</Link>
                    <Link to="/event/admin/add-registration" className="navLink__Event__main__Admin">Add Registration</Link>
                            <Link to="/event/admin/analytics" className="navLink__Event__main__Admin">Event Analytics</Link>
                            <Link to="/event/admin/sponsor" className="navLink__Event__main__Admin">Add Sponsor</Link>

        </div>
      </div>
      <h2 className="heading__admin__session__page">Manage Sessions</h2>

      <div className="create__session__form__admin__page">
        <input
          className="input__admin__session__page"
          value={newSessionName}
          onChange={(e) => setNewSessionName(e.target.value)}
          placeholder="Enter session name"
        />
        <button className="button__admin__session__page" onClick={createSession}>
          Create Session
        </button>
      </div>

      <div className="session__list__admin__page">
        <h3>Active Sessions</h3>
        {sessions.filter(s => s.is_active).map(s => (
          <div key={s.id} className="session__card__admin__page active">
            <p>{s.name}</p>
            <button onClick={() => showAttendees(s)}>Show Attendees</button>
            <button onClick={() => endSession(s.id)}>End Session</button>
          </div>
        ))}

        <h3>Inactive Sessions</h3>
        {sessions.filter(s => !s.is_active).map(s => (
          <div key={s.id} className="session__card__admin__page inactive">
            <p>{s.name}</p>
          </div>
        ))}
      </div>
            {/* Attendee Modal */}
            {showModal && (
  <div className="modal__admin__session__page">
    <div className="modal__content__admin__session__page">
      <button
        className="modal__close__btn__admin__session__page"
        onClick={() => setShowModal(false)}
      >
        ×
      </button>

      <h3>Attendees for {selectedSession?.name}</h3>

      <h4>
        Registered Attendees ({attendees.attendees.length})
      </h4>
      {attendees.attendees.length > 0 ? (
        <ul>
          {attendees.attendees.map((att, idx) => (
            <li key={idx}>
              {att.honorific} {att.first_name} {att.last_name} ({att.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>No registered attendees yet.</p>
      )}

      <h4>
        Sponsor Attendees ({attendees.sponsors.length})
      </h4>
      {attendees.sponsors.length > 0 ? (
        <ul>
          {attendees.sponsors.map((s, idx) => (
            <li key={idx}>
              {s.name} – {s.organization || 'No org'} ({s.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>No sponsor attendees yet.</p>
      )}

      <hr style={{ marginTop: '20px', marginBottom: '10px' }} />
      <p style={{ fontWeight: 'bold' }}>
        Total Attendees: {attendees.attendees.length + attendees.sponsors.length}
      </p>
    </div>
  </div>
)}

    </div>
  );
}

export default SessionsPage;
