export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-200">
      <div className="p-8 text-center text-white bg-red-400 rounded-lg shadow-lg">
        <p className="mt-2 text-xl">Page Not Found</p>
        <p className="mt-4 text-sm opacity-90">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="mt-2 text-sm opacity-90">
          Please check the URL or go back to the homepage.
        </p>
      </div>
    </div>
  );
}
