import { useState, useMemo, useCallback, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAction, getUsersAction } from "../../store/actions/userActions";
import { RootState } from "../../store";

// Icons extracted as separate components for reusability


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
      <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
      <p className="text-sm text-gray-500">{user.emailId}</p>
    </div>

    <div className="w-1/3 font-medium text-center">Manager</div>

    <div className="w-1/3 flex justify-end space-x-2">
      <button
        className="bg-transparent text-black px-4 py-2 border border-gray-200 rounded-md"
        onClick={() => onEdit(user)}
        aria-label={`Edit ${user.firstName}`}
      >

        <EditIcon />
      </button>

      <button
        className="p-2 rounded-md border border-gray-200 text-red-600"
        onClick={() => onDelete(user)}
        aria-label={`Delete ${user.firstName}`}
      >
        <DeleteIcon />
      </button>
    </div>
  </div>
);

const UserManagement = () => {
  const dispatch = useDispatch()
  const usersListRedux = useSelector(
    (state: RootState) => state.users?.lists?.data
  );
  // Initial user data moved outside component to prevent recreation on render


  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Memoized calculations
  // const stats = useMemo(() => {
  //   const managerCount = users?.filter((user) => user.role === "Manager").length;
  //   return {
  //     totalEmployees: users.length,
  //     activeLogs: 5, // This would typically come from an API
  //     managers: managerCount,
  //     supervisions: 2, // This would typically come from an API
  //   };
  // }, [users]);

  // Event handlers as callbacks to prevent recreation on render
  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    setIsModalOpen(true);
  }, []);

  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

  const handleDeleteUser = (userToDelete) => {
    console.log('userToDelete', userToDelete)
    dispatch(deleteUserAction({ id: userToDelete, obj: { reason: '' } }))

  };

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
  useEffect(() => {
    if (usersListRedux !== null || undefined) {
      setUsers(usersListRedux)
    }
  }, [usersListRedux])
  useEffect(() => {
    dispatch(getUsersAction())
  }, [])


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



      <div className="flex justify-end mb-6">
        <button
          className="bg-[#65558F] text-white px-4 py-2 rounded-full"
          onClick={handleAddUser}
        >
          Add Users
        </button>
      </div>

      <section className="space-y-4">
        {users?.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onEdit={handleEditUser}
            onDelete={() => handleDeleteUser(user._id)}
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
