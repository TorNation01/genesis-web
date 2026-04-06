export default function AuthErrorBanner({ show }) {
  if (!show) return null;
  return (
    <p
      className="mb-6 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-center text-sm text-red-200"
      role="alert"
    >
      Sign-in did not complete. Please try again.
    </p>
  );
}
