import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { LoginUserService } from '../../api/services/authServices'; // Assuming this service is correctly defined

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await LoginUserService({ email, password });
      if (response.success) {
        // Assuming the response contains a `success` flag and `userId`
        console.log('Login successful:', response);
        
        // Save userId in localStorage
        localStorage.setItem('userId', response.userId); // Save userId to local storage
        
        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed. Please try again.'); // Show error message if available
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: isDarkMode ? '#121212' : '#f0f0f0',
        padding: '20px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '350px',
          padding: '30px',
          border: isDarkMode ? '1px solid #444' : '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
          color: isDarkMode ? '#f5f5f5' : '#000',
          boxShadow: isDarkMode
            ? '0px 4px 6px rgba(0, 0, 0, 0.8)'
            : '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '25px',
            fontSize: '1.5rem',
            color: isDarkMode ? '#f5f5f5' : '#000',
          }}
        >
          Login
        </h2>
        {error && (
          <p
            style={{
              color: 'red',
              textAlign: 'center',
              marginBottom: '15px',
            }}
          >
            {error}
          </p>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="email"
            style={{
              fontSize: '1rem',
              color: isDarkMode ? '#f5f5f5' : '#000',
            }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '8px',
              border: '1px solid',
              borderColor: isDarkMode ? '#555' : '#ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
              color: isDarkMode ? '#f5f5f5' : '#000',
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="password"
            style={{
              fontSize: '1rem',
              color: isDarkMode ? '#f5f5f5' : '#000',
            }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '8px',
              border: '1px solid',
              borderColor: isDarkMode ? '#555' : '#ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
              color: isDarkMode ? '#f5f5f5' : '#000',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isDarkMode ? '#007bff' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = isDarkMode
              ? '#0056b3'
              : '#0056b3')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = isDarkMode
              ? '#007bff'
              : '#007bff')
          }
        >
          Login
        </button>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <span>Don't have an account?</span>{' '}
          <a href="/signup" style={{ color: isDarkMode ? '#90caf9' : '#007bff' }}>
            Sign Up
          </a>
        </div>
        <button
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '10px',
            backgroundColor: '#db4437',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Google Login
        </button>
      </form>
    </div>
  );
};

export default Login;
