import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUserService } from '../../api/services/authServices';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await LoginUserService({ email, password });
      if (response.success) {
        localStorage.setItem('userId', response.userId);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div
    className={`
      flex justify-center items-center h-screen w-screen 
      ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-100'}
      p-5
    `}
  >
  
      <form 
        onSubmit={handleSubmit} 
        className={`
          w-[350px] p-7 rounded-lg 
          ${isDarkMode 
            ? 'bg-[#1e1e1e] border-[#444] text-gray-100 shadow-[0px_4px_6px_rgba(0,0,0,0.8)]' 
            : 'bg-white border-gray-300 text-black shadow-md'}
          border
        `}
      >
        <h2 className={`
          text-center mb-6 text-2xl 
          ${isDarkMode ? 'text-gray-100' : 'text-black'}
        `}>
          Login
        </h2>
        
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}
        
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className={`
              text-base 
              ${isDarkMode ? 'text-gray-100' : 'text-black'}
            `}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`
              w-full p-2.5 mt-2 rounded-md text-base
              ${isDarkMode 
                ? 'bg-[#1e1e1e] border-[#555] text-gray-100' 
                : 'bg-white border-gray-300 text-black'}
              border
            `}
          />
        </div>
        
        <div className="mb-5">
          <label 
            htmlFor="password" 
            className={`
              text-base 
              ${isDarkMode ? 'text-gray-100' : 'text-black'}
            `}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`
              w-full p-2.5 mt-2 rounded-md text-base
              ${isDarkMode 
                ? 'bg-[#1e1e1e] border-[#555] text-gray-100' 
                : 'bg-white border-gray-300 text-black'}
              border
            `}
          />
        </div>
        
        <button
          type="submit"
          className="
            w-full p-3 bg-blue-600 text-white 
            rounded-md text-base cursor-pointer 
            hover:bg-blue-700 transition-colors
          "
        >
          Login
        </button>
        
        <div className="mt-4 text-center">
          <span>Don't have an account?</span>{' '}
          <a 
            href="/signup" 
            className={`
              ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}
            `}
          >
            Sign Up
          </a>
        </div>
        
        <button
          className="
            mt-3 w-full p-2.5 bg-red-500 
            text-white rounded-md text-base 
            cursor-pointer hover:bg-red-600
          "
        >
          Google Login
        </button>
      </form>
    </div>
  );
};

export default Login;