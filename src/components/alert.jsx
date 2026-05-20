const Alert = ({ message, onClose }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        color: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        maxWidth: "400px",
      }}
    >
      <span style={{ fontSize: "14px", fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: "16px",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;
