export function MobileBlocker() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#FAFAD2",
        zIndex: 9999,
      }}
    >
      <img
        src="/image/desktop_only.png"
        alt="Desktop only"
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "contain",
          objectPosition: "center",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
