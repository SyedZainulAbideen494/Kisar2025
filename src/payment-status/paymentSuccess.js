import React from "react";
import { FaCheckCircle } from "react-icons/fa"; 

const PaymentSuccess = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <FaCheckCircle
        style={{
          fontSize: "120px",
          color: "#28a745", // Green color for success
          marginBottom: "20px",
        }}
      />
      <h1
        style={{
          fontSize: "32px",
          color: "#333",
          marginBottom: "10px",
        }}
      >
        Payment Success
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "#666",
          maxWidth: "600px",
          lineHeight: "1.5",
        }}
      >
        Your payment has been successfully processed. You will receive an email shortly with your confirmation receipt and invoice.
      </p>
    </div>
  );
};

export default PaymentSuccess;