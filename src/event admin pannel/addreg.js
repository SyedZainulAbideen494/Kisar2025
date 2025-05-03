import React, { useState, useEffect } from "react";
import axios from "axios";
import './AddEventRegPage.css';  // Add CSS for the form
import { Link } from "react-router-dom";
import { API_ROUTES } from "../app modules/apiRoutes";

function AddEventRegPage() {
    const [packages, setPackages] = useState([]);
    const [form, setForm] = useState({
      honorific: 'Mr',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      med_council_number: '',
      category: 'DELEGATE',
      type: 'clinical',
      package_ids: []
    });
  
    useEffect(() => {
      axios.get(`${API_ROUTES.baseUrl}/api/packages`)
        .then(res => setPackages(res.data))
        .catch(err => console.error(err));
    }, []);
  
    const handleChange = e => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };
  
    const handlePackageSelect = e => {
      const id = parseInt(e.target.value);
      setForm(prev => ({
        ...prev,
        package_ids: e.target.checked
          ? [...prev.package_ids, id]
          : prev.package_ids.filter(pid => pid !== id)
      }));
    };
  
    const handleSubmit = async e => {
      e.preventDefault();
      try {
        await axios.post(`${API_ROUTES.baseUrl}api/register/event/admin`, form);
        alert('Registered successfully!');
      } catch (err) {
        alert('Error: ' + err.message);
      }
    };
  
    return  (
        <form className="form__event__admin__Add__Reg" onSubmit={handleSubmit}>
              {/* Navbar */}
       <div className="navbar__Event__main__Admin">
        <div className="navLogo__Event__main__Admin">Event Admin</div>
        <div className="navLinks__Event__main__Admin">
          <Link to="/event/admin/main" className="navLink__Event__main__Admin">Home</Link>
          <Link to="/event/admin/session" className="navLink__Event__main__Admin">Sessions</Link>
                    <Link to="/event/admin/add-registration" className="navLink__Event__main__Admin navActive__Event__main__Admin">Add Registration</Link>
        
        </div>
      </div>
          <select className="input__event__admin__Add__Reg" name="honorific" onChange={handleChange}>
            <option>Mr</option>
            <option>Ms</option>
            <option>Dr</option>
          </select>
    
          <input className="input__event__admin__Add__Reg" name="first_name" placeholder="First Name" onChange={handleChange} required />
          <input className="input__event__admin__Add__Reg" name="middle_name" placeholder="Middle Name" onChange={handleChange} />
          <input className="input__event__admin__Add__Reg" name="last_name" placeholder="Last Name" onChange={handleChange} required />
          <input className="input__event__admin__Add__Reg" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="input__event__admin__Add__Reg" name="phone" placeholder="Phone" onChange={handleChange} required />
          <input className="input__event__admin__Add__Reg" name="address" placeholder="Address" onChange={handleChange} />
          <input className="input__event__admin__Add__Reg" name="city" placeholder="City" onChange={handleChange} />
          <input className="input__event__admin__Add__Reg" name="state" placeholder="State" onChange={handleChange} />
          <input className="input__event__admin__Add__Reg" name="pincode" placeholder="Pincode" onChange={handleChange} />
          <input className="input__event__admin__Add__Reg" name="med_council_number" placeholder="Medical Council Number" onChange={handleChange} />
    
          <select className="input__event__admin__Add__Reg" name="category" onChange={handleChange}>
            <option>DELEGATE</option>
            <option>FACULTY</option>
          </select>
    
          <select className="input__event__admin__Add__Reg" name="type" onChange={handleChange}>
            <option value="clinical">Clinical</option>
            <option value="embryologist">Embryologist</option>
          </select>
    
          <div className="packages__event__admin__Add__Reg">
            <p className="label__event__admin__Add__Reg">Select Packages:</p>
            {packages.map(pkg => (
              <label className="checkbox__event__admin__Add__Reg" key={pkg.id}>
                <input
                  type="checkbox"
                  value={pkg.id}
                  onChange={handlePackageSelect}
                />
                {pkg.name}
              </label>
            ))}
          </div>
    
          <button className="submit__event__admin__Add__Reg" type="submit">Register</button>
        </form>
      );
  };

export default AddEventRegPage;
