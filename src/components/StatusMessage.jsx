export default function StatusMessage({
  title,
  children,
  retry,
  error = false,
}) {
  return (
    <div className="status-message" role={error ? "alert" : "status"}>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {retry && (
        <button className="primary" onClick={retry}>
          Yritä uudelleen
        </button>
      )}
    </div>
  );
}
