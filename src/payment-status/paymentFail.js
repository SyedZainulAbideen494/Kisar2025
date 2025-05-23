import React from "react";
import Lottie from "lottie-react";
import failAnimation from "./fail-cross.json"; // Ensure this JSON file is in the correct folder

const PaymentFail = () => {
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
        <Lottie animationData={failAnimation} loop={false} />
      </div>
      <h1
        style={{
          fontSize: "32px",
          color: "#333",
          marginBottom: "10px",
        }}
      >
        Payment Failed
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "#666",
          maxWidth: "600px",
          lineHeight: "1.5",
        }}
      >
        Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
      </p>
    </div>
  );
};

export default PaymentFail;
