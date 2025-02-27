import { useState, useMemo, useCallback } from "react";
import AddUserModal from "./AddUserModal";

// Icons extracted as separate components for reusability
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

// Reusable components
const StatCard = ({ label, value, children }) => (
  <div className="bg-[#65558F] bg-opacity-10 rounded-xl p-4 flex items-center">
    {children}
    <div>
      <p className="text-base text-black">{label}</p>
      <p className="text-3xl font-bold text-indigo-900">{value}</p>
    </div>
  </div>
);
const UserCard = ({ user, onEdit, onDelete }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-md">
    <div className="w-1/3">
      <h3 className="font-medium">{user.name}</h3>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>

    <div className="w-1/3 font-medium text-center">{user.role}</div>

    <div className="w-1/3 flex justify-end space-x-2">
      <button
        className="bg-transparent text-black px-4 py-2 border border-gray-200 rounded-md"
        onClick={() => onEdit(user)}
        aria-label={`Edit ${user.name}`}
      >
       
        <EditIcon />
      </button>

      <button
        className="p-2 rounded-md border border-gray-200 text-red-600"
        onClick={() => onDelete(user)}
        aria-label={`Delete ${user.name}`}
      >
        <DeleteIcon />
      </button>
    </div>
  </div>
);

const UserManagement = () => {
  // Initial user data moved outside component to prevent recreation on render
  const initialUsers = [
    { id: 1, name: "Nitya Prakhar", email: "nitya@gmail.com", role: "Sales" },
    {
      id: 2,
      name: "Namita Sharma",
      email: "namita@gmail.com",
      role: "Marketer",
    },
    {
      id: 3,
      name: "Mohanraj Tamilrasu",
      email: "mohanraj@gmail.com",
      role: "Tech",
    },
    {
      id: 4,
      name: "Nayna Agarwal",
      email: "nayna@gmail.com",
      role: "PR",
    },
    { id: 5, name: "Sunny Ramani", email: "sunny@gmail.com", role: "Tech" },
    {
      id: 6,
      name: "Sneha Jhaveri",
      email: "sneha@gmail.com",
      role: "Designer",
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Memoized calculations
  const stats = useMemo(() => {
    const managerCount = users.filter((user) => user.role === "Manager").length;
    return {
      totalEmployees: users.length,
      activeLogs: 5, // This would typically come from an API
      managers: managerCount,
      supervisions: 2, // This would typically come from an API
    };
  }, [users]);

  // Event handlers as callbacks to prevent recreation on render
  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    setIsModalOpen(true);
  }, []);

  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

  const handleDeleteUser = useCallback((userToDelete) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userToDelete.id)
    );
  }, []);

  const handleSaveUser = useCallback(
    (userData) => {
      if (editingUser) {
        // Update existing user
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id ? { ...user, ...userData } : user
          )
        );
      } else {
        // Add new user
        setUsers((prevUsers) => [
          ...prevUsers,
          { ...userData, id: Math.max(...prevUsers.map((u) => u.id), 0) + 1 },
        ]);
      }
      setIsModalOpen(false);
    },
    [editingUser]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
  }, []);

  return (
    <div className="bg-white p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-gray-800">
          User & Role Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage user accounts, roles, and permissions to streamline access
          control across your platform.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-10">
        <StatCard
          label="Total Number Of Employees"
          value={stats.totalEmployees}
          children={undefined}
        />
        <StatCard
          label="Active Logs"
          value={stats.activeLogs}
          children={undefined}
        />

        <StatCard label="Managers" value={stats.managers}>
          <div className="flex -space-x-2 mr-4">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-black text-sm">
              A
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-black text-sm">
              F
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-black text-sm">
              +2
            </div>
          </div>
        </StatCard>

        <StatCard
          label="Supervisions"
          value={stats.supervisions}
          children={undefined}
        />
      </section>

      <div className="flex justify-end mb-6">
        <button
          className="bg-[#65558F] text-white px-4 py-2 rounded-full"
          onClick={handleAddUser}
        >
          Add Users
        </button>
      </div>

      <section className="space-y-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ))}
      </section>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;
