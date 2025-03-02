import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhoneAlt, FaRegCreditCard } from "react-icons/fa";
import KisarChatbot from "../ai chat bot/KisarChatbot";
import Cart from "./KisarCart"; // Import Cart component
import "./KisarRegistration.css";
import { API_ROUTES } from "../app modules/apiRoutes";

function KisarRegistration() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [packages, setPackages] = useState({});
  const [selectedPackages, setSelectedPackages] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch package details from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/packages");
        if (Array.isArray(data)) {
          const packageData = data.reduce((acc, pkg) => {
            acc[pkg.name.toLowerCase()] = pkg.price;
            return acc;
          }, {});

          setPackages(packageData);
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

      if (Object.keys(selectedPackages).length === 0) {
        alert("Please select at least one package.");
        return;
      }

      const totalAmount = Object.keys(selectedPackages).reduce(
        (total, pkg) => total + selectedPackages[pkg] * packages[pkg],
        0
      );

      const { data } = await axios.post(API_ROUTES.createOrder, {
        amount: totalAmount,
        currency: "INR",
        event: "Kisar",
        token,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        package: selectedPackages,
      });

      const options = {
        key: "rzp_test_RerVxaTytL17Ax",
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Kisar Event",
        description: `Kisar Event - Selected Packages`,
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
            package: selectedPackages,
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
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        </div>

        <div className="input-container">
          <FaEnvelope className="icon" />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
        </div>

        <div className="input-container">
          <FaPhoneAlt className="icon" />
          <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
        </div>

        {/* Select Packages Button */}
        <button className="select-packages-btn" onClick={() => setCartOpen(true)}>
          Select Packages
        </button>

        <h4>Selected Packages:</h4>
        {Object.keys(selectedPackages).length === 0 ? (
          <p>No packages selected</p>
        ) : (
          <ul>
            {Object.keys(selectedPackages).map((pkg) => (
              <li key={pkg}>
                {pkg.charAt(0).toUpperCase() + pkg.slice(1)} x{selectedPackages[pkg]}
              </li>
            ))}
          </ul>
        )}

        <button onClick={handlePayment} disabled={loading}>
          <FaRegCreditCard className="button-icon" /> Pay ₹
          {Object.keys(selectedPackages).reduce(
            (total, pkg) => total + selectedPackages[pkg] * packages[pkg],
            0
          )}
        </button>
      </div>

      {/* Render Cart Modal */}
      {cartOpen && (
        <Cart
          packages={packages}
          onClose={() => setCartOpen(false)}
          onConfirm={(selected) => {
            setSelectedPackages(selected);
            setCartOpen(false);
          }}
        />
      )}

      <KisarChatbot />
    </div>
  );
}

export default KisarRegistration;

