function EmberDivider({ width = 200, color = "var(--amber)" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        margin: "1.5rem auto",
        width: `${width}px`,
        maxWidth: "90%",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(to left, ${color}, transparent)`,
        }}
      />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        style={{ flexShrink: 0, opacity: 0.7 }}
      >
        <path
          d="M12 2C10 6 6 8 6 13a6 6 0 0 0 12 0c0-5-4-7-6-11z"
          fill={color}
        />
        <path
          d="M12 9c-1 2-3 3-3 5.5a3 3 0 0 0 6 0c0-2.5-2-3.5-3-5.5z"
          fill="var(--cream)"
          opacity="0.6"
        />
      </svg>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(to right, ${color}, transparent)`,
        }}
      />
    </div>
  );
}

export default EmberDivider;
