import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhoneAlt, FaRegCreditCard, FaBox } from "react-icons/fa";
import KisarChatbot from "../ai chat bot/KisarChatbot";
import "./KisarRegistration.css";
import { API_ROUTES } from "../app modules/apiRoutes";

function KisarRegistration() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", package: "" });
  const [packages, setPackages] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch package details from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/packages"); // Change URL if needed
        if (Array.isArray(data)) {
          const packageData = data.reduce((acc, pkg) => {
            acc[pkg.name.toLowerCase()] = pkg.price; // Convert names to lowercase for uniformity
            return acc;
          }, {});
  
          setPackages(packageData);
          setFormData((prev) => ({ ...prev, package: Object.keys(packageData)[0] })); // Set default package
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    };
  
    fetchPackages();
  }, []);
  
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to register.");
        return;
      }

      const selectedPackage = formData.package;
      const amount = packages[selectedPackage];

      const { data } = await axios.post(API_ROUTES.createOrder, {
        amount,
        currency: "INR",
        event: "Kisar",
        token,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        package: selectedPackage,
      });

      const options = {
        key: "rzp_test_RerVxaTytL17Ax",
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Kisar Event",
        description: `Kisar Event - ${selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Package`,
        handler: async (response) => {
          const verifyResponse = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            event: "Kisar",
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            package: selectedPackage,
          });

          if (verifyResponse.data.success) {
            alert("Registration Successful!");
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#1a1a1a" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error initiating payment", error);
      alert("Error initiating payment");
    }
  };

  return (
<div className="kisar-container">
  <div className="kisar-box">
    <h2 className="title">Kisar Event Registration</h2>

    <div className="input-container">
      <FaUser className="icon" />
      <input
        type="text"
        name="name"
        placeholder="Full Name"
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
        onChange={handleChange}
        required
      />
    </div>

    {/* Package Dropdown */}
    {loading ? (
      <p>Loading packages...</p>
    ) : (
      <select
        name="package"
        onChange={handleChange}
        value={formData.package}
        className="dropdown"
        style={{
          color: "#333",
          padding: "8px",
          borderRadius: "5px",
          marginBottom: "30px",
          border: '1px solid #333'
        }}
      >
        {Object.keys(packages).map((key) => (
          <option key={key} value={key} style={{ background: "#1a1a1a", color: "#fff" }}>
            {key.charAt(0).toUpperCase() + key.slice(1)} - ₹{packages[key]}
          </option>
        ))}
      </select>
    )}

    <button onClick={handlePayment} disabled={loading}>
      <FaRegCreditCard className="button-icon" /> Register & Pay ₹{packages[formData.package] || 0}
    </button>
  </div>

  {/* Chatbot Component */}
  <KisarChatbot />
</div>

  );
}

export default KisarRegistration;
