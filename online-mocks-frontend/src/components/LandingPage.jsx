import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-6 w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800">Welcome</h1>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/hr-login')}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            HR Login
          </button>
          <button
            onClick={() => navigate('/volunteer-login')}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Volunteer Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;