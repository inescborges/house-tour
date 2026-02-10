export function DeathOverlay() {
  return (
    <div className="death-overlay">
      <p style={{ maxWidth: 500, textAlign: "center" }}>
        You just got swallowed by a hovering shadow.
      </p>

      <p className="hint">
        Press <b>ENTER</b> to explore again
      </p>
    </div>
  );
}
