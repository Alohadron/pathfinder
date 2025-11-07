export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
