import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhoneAlt, FaRegCreditCard } from "react-icons/fa";
import KisarChatbot from "../ai chat bot/KisarChatbot";
import Cart from "./KisarCart";
import "./KisarRegistration.css";
import { API_ROUTES } from "../app modules/apiRoutes";

function KisarRegistration() {
  const [formData, setFormData] = useState({
    honorific: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    med_council_number: "",
    category: "DELEGATE",
    type: "",
  });
  const [packages, setPackages] = useState([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const formRef = useRef(null); // Reference to the form container
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [tcOpen, setTcOpen] = useState(true); // T&C dialog state
  const [tcAgreed, setTcAgreed] = useState(false); // T&C agreement state
  

  // Fetch packages and scroll to top on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get(API_ROUTES.packages);
        if (Array.isArray(data)) {
          setPackages(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    };

    fetchPackages();

    // Scroll to top when component mounts
    if (formRef.current) {
      formRef.current.scrollTo(0, 0);
    }
  }, []);

  const handleTcAgree = () => {
    setTcAgreed(true);
    setTcOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate email
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({ ...errors, email: emailRegex.test(value) ? "" : "Invalid email format" });
    }

    // Validate phone number (10 digits only)
    if (name === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      setErrors({ ...errors, phone: phoneRegex.test(value) ? "" : "Phone number must be 10 digits" });
    }
  };


  const handlePaymentRazorpay = async () => {
    try {
      const token = localStorage.getItem("token");

      if (selectedPackageIds.length === 0) {
        alert("Please select at least one package.");
        return;
      }

      const totalAmount = selectedPackageIds.reduce((total, pkgId) => {
        const pkg = packages.find((p) => p.id === pkgId);
        return total + (pkg ? parseFloat(pkg.price) : 0);
      }, 0);

      const { data } = await axios.post(API_ROUTES.createOrder, {
        amount: totalAmount,
        currency: "INR",
        event: "Kisar 2025",
        token,
        ...formData,
        package_ids: selectedPackageIds,
      });

      const options = {
        key: "rzp_test_RerVxaTytL17Ax",
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Kisar 2025 Event",
        description: `Kisar 2025 Event - Selected Packages`,
        handler: async (response) => {
          const verifyResponse = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            event: "Kisar 2025",
            ...formData,
            package_ids: selectedPackageIds,
          });

          if (verifyResponse.data.success) {
            alert("Registration Successful!");
            setFormData({
              honorific: "",
              first_name: "",
              middle_name: "",
              last_name: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
              med_council_number: "",
              category: "DELEGATE",
              type: "",
            });
            setSelectedPackageIds([]);
            if (formRef.current) {
              formRef.current.scrollTo(0, 0); // Scroll to top after success
            }
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#1a1a1a" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment");
    }
  };

  const handlePaymentInstamojo = async () => {
    try {
      // Check if at least one package is selected
      if (selectedPackageIds.length === 0) {
        alert("Please select at least one package.");
        return;
      }
  
      // Required field validations (except med_council_number, type, and middle_name)
      const requiredFields = {
        honorific: "Honorific is required",
        first_name: "First Name is required",
        last_name: "Last Name is required",
        email: "Email is required",
        phone: "Phone Number is required",
        address: "Address is required",
        city: "City is required",
        state: "State is required",
        pincode: "Pincode is required",
        category: "Category is required",
      };
  
      for (const [field, message] of Object.entries(requiredFields)) {
        if (!formData[field] || formData[field].trim() === "") {
          alert(message);
          return;
        }
      }
  
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }
  
      // Phone number format validation (Indian 10-digit starting with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert("Please enter a valid 10-digit phone number");
        return;
      }

      // Pincode validation (6 digits, starting with 1-9)
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }
  
      // Calculate total amount
      const totalAmount = selectedPackageIds.reduce((total, pkgId) => {
        const pkg = packages.find((p) => p.id === pkgId);
        return total + (pkg ? parseFloat(pkg.price) : 0);
      }, 0);
  
      // Make API request to create an order
      const { data } = await axios.post(API_ROUTES.createOrder, {
        amount: totalAmount,
        honorific: formData.honorific,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        med_council_number: formData.med_council_number,
        category: formData.category,
        type: formData.type,
        package_ids: selectedPackageIds, // Send array of package IDs
      });
  
      // Redirect to Instamojo payment URL
      if (data.payment_request && data.payment_request.url) {
        window.location.href = data.payment_request.url;
      } else {
        throw new Error("No payment URL received from Instamojo");
      }
    } catch (error) {
      console.error("Error initiating Instamojo payment:", error);
      alert("Error initiating payment with Instamojo");
    }
  };
  

  return (
    <div className="kisar-container" ref={formRef}>
      <div className="kisar-box">
        <h2 className="title">10th Annual Conference - Kisar 2025 Registration</h2>

        <div className="input-container">
          <FaUser className="icon" />
          <select name="honorific" value={formData.honorific} onChange={handleChange}>
            <option value="">Select Honorific</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Dr.">Dr.</option>
          </select>
        </div>

        <div className="input-container">
          <FaUser className="icon" />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <FaUser className="icon" />
          <input
            type="text"
            name="middle_name"
            placeholder="Middle Name (Optional)"
            value={formData.middle_name}
            onChange={handleChange}
          />
        </div>

        <div className="input-container">
          <FaUser className="icon" />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <FaPhoneAlt className="icon" />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            name="med_council_number"
            placeholder="Medical Council Number (if applicable)"
            value={formData.med_council_number}
            onChange={handleChange}
          />
        </div>

        <div className="input-container">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="DELEGATE">Delegate</option>
            <option value="FACULTY">Faculty</option>
          </select>
        </div>

        <div className="input-container">
          <input
            type="text"
            name="type"
            placeholder="Type (e.g., Clinician, Embryologist)"
            value={formData.type}
            onChange={handleChange}
          />
        </div>

        <button className="select-packages-btn" onClick={() => setCartOpen(true)}>
          Select Packages
        </button>

        <h4>Selected Packages:</h4>
        {selectedPackageIds.length === 0 ? (
          <p>No packages selected</p>
        ) : (
          <ul>
            {selectedPackageIds.map((pkgId) => {
              const pkg = packages.find((p) => p.id === pkgId);
              return pkg ? <li key={pkgId}>{pkg.name} - ₹{pkg.price}</li> : null;
            })}
          </ul>
        )}

        <button onClick={handlePaymentInstamojo} disabled={loading}>
          <FaRegCreditCard className="button-icon" /> Pay ₹
          {selectedPackageIds.reduce((total, pkgId) => {
            const pkg = packages.find((p) => p.id === pkgId);
            return total + (pkg ? parseFloat(pkg.price) : 0);
          }, 0)}
        </button>
      </div>

      {/* Terms & Conditions Dialog */}
      {tcOpen && (
        <div className="tc-modal">
          <div className="tc-content">
            <h2>Terms & Conditions</h2>
            <div className="tc-text">
              <p>Please review and agree to the following terms before proceeding with registration:</p>
              <ul>
                <li><strong>Non-Residential Registration:</strong> Includes access to the conference and banquet only.</li>
                <li><strong>Residential – Single Occupancy (2 Days):</strong> Covers accommodation, conference participation, and banquet access for one individual.</li>
                <li><strong>Residential – Twin Sharing (2 Days):</strong> Includes accommodation, conference, and banquet access; price is per person sharing the room.</li>
                <li><strong>Double Occupancy:</strong> Provides accommodation for two people, with conference and banquet access for one registrant.</li>
                <li><strong>Accompanying Person (Double Occupancy):</strong> Banquet access is available only with mandatory registration.</li>
              </ul>
            </div>
            <div className="tc-buttons">
              <button onClick={handleTcAgree} className="tc-agree">I Agree</button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <Cart
          packages={packages}
          onClose={() => setCartOpen(false)}
          onConfirm={(selectedIds) => {
            setSelectedPackageIds(selectedIds);
            setCartOpen(false);
          }}
        />
      )}


    </div>
  );
}

export default KisarRegistration;