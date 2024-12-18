import React from "react";

function Dashboard() {
  // Handle logout
  const handleLogout = () => {
    // Clear specific fields from localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('roleName');
    localStorage.removeItem('orgName');
    localStorage.removeItem('moduleMap');
    
    // Optionally, redirect to login page or homepage after logout
    window.location.href = '/login'; // Replace with your login route
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
