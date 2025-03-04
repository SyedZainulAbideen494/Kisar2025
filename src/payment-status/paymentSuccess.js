import React from "react";
import Lottie from "lottie-react";
import successAnimation from "./success-tick.json"; // Make sure this JSON file is in the correct folder

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
      <div style={{ width: "120px", height: "120px", marginBottom: "20px" }}>
        <Lottie animationData={successAnimation} loop={false} />
      </div>
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
        Your payment has been successfully processed. You will receive an email shortly with your confirmation receipt. You can close this window.
      </p>
    </div>
  );
};

export default PaymentSuccess;
