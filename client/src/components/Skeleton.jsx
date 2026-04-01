function Skeleton({ type = "text", count = 1 }) {
  const skeletonBase = {
    background: "linear-gradient(90deg, #F5E6D3 25%, #FAF0E6 50%, #F5E6D3 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite ease-in-out",
    borderRadius: "6px",
  };

  const types = {
    text: { width: "100%", height: "14px", marginBottom: "10px" },
    heading: { width: "60%", height: "28px", marginBottom: "16px" },
    card: { width: "100%", height: "180px", marginBottom: "16px", borderRadius: "12px" },
    image: { width: "100%", height: "250px", borderRadius: "8px" },
    "menu-item": { width: "100%", height: "72px", marginBottom: "12px" },
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            ...skeletonBase,
            ...types[type],
            ...(type === "text" && i === count - 1 ? { width: "75%" } : {}),
          }}
        />
      ))}
    </>
  );
}

export default Skeleton;
