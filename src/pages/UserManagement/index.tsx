import { useState, useCallback, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewUser,
  deleteUserAction,
  getUsersAction,
} from "../../store/actions/userActions";
import { RootState } from "../../store";
import { COLORS } from "../../constants";
import StackedAvatars from "../../components/StackedAvatars";
import ConfirmationModal from "../../components/confirmationModal";


type User = {
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNo: string;
  status: "active" | "inactive" | "registered";
  roleName: string;
  module_mapS: number[];
  _id: string;
};

interface StatItem {
  label: string;
  value: string | number;
  component?: React.ReactNode;
}

interface UserHeaderProps {
  users: User[];
}

const colors = [
  "bg-blue-500",
  "bg-red-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

const StatCard = ({ label, value, component }) => (
  <div
    className={`rounded-xl p-4 flex items-center max-w-full w-full ${component ? "flex justify-between" : ""
      }`}
    style={{ backgroundColor: COLORS.LIGHTLAVENDER }}
  >
    <div>
      <p className="text-base" style={{ color: COLORS.NEUTRALGRAY }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: COLORS.DARKVIOLET }}>
        {value}
      </p>
    </div>
    {component && <div>{component}</div>}
  </div>
);

const userData = (users) => {
  return users.map((user) => ({
    ...user,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

const UserHeader: React.FC<UserHeaderProps> = ({ users }) => {
  const processedStats: StatItem[] = users?.length
    ? [
      {
        label: "Total Number Of Employees",
        value: "100",
      },
      {
        label: "Active Logs",
        value: "5",
        component: <StackedAvatars userData={userData(users)} />,
      },
      {
        label: "Managers",
        value: "9",
      },
      {
        label: "Supervisions",
        value: "8",
      },
    ]
    : [];

  return (
    <div className="flex justify-between items-center mb-4 gap-4">
      {processedStats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          component={stat.component}
        />
      ))}
    </div>
  );
};

const UserCard = ({ user, onEdit, onDelete }) => (
  <div
    className="flex items-center justify-between p-4 border border-gray-100 rounded-md"
    style={{ backgroundColor: COLORS.LIGHTLAVENDER }}
  >
    <div className="w-1/3">
      <h3 className="font-medium">
        {user.firstName} {user.lastName}
      </h3>
      <p className="text-sm text-gray-500">{user.emailId}</p>
    </div>

    <div className="w-1/3 font-medium text-center">{user.roleName}</div>

    <div className="w-1/3 flex justify-end space-x-2">
      <button
        className="bg-transparent px-4 py-2 rounded-full"
        style={{
          color: COLORS.VIOLET,
          border: `1px solid ${COLORS.DARKGRAY}`,
        }}
        onClick={() => onEdit(user)}
        aria-label={`Edit ${user.firstName}`}
      >
        <EditIcon /> Edit
      </button>

      <button
        className=" text-red-600"
        onClick={() => onDelete(user._id)}
        aria-label={`Delete ${user.firstName}`}
      >
        <DeleteIcon />
      </button>
    </div>
  </div>
);

const UserManagement = () => {
  const dispatch = useDispatch();
  const usersListRedux = useSelector(
    (state: RootState) => state.users?.lists?.data?.data?.users
  );

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    setIsModalOpen(true);
  }, []);

  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((userId) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (userToDelete) {
      dispatch(
        deleteUserAction({ id: userToDelete, obj: { reason: deleteReason } })
      );
    }
    setIsDeleteModalOpen(false);
    setDeleteReason("");
  }, [userToDelete, deleteReason]);

  const handleSaveUser = (userData) => {
    if (editingUser?.id) {
      // Update existing user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...userData } : user
        )
      );
    } else {
      // Add new user
      const payload = {
        emailId: userData.employeeId,
        mobileNo: userData.mobileNo,
        role: userData.role,
        modules: userData.modules,
      };
      dispatch(createNewUser(payload));
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
  }, []);

  useEffect(() => {
    if (usersListRedux !== null || undefined) {

      setUsers(usersListRedux);
    }
  }, [usersListRedux]);

  useEffect(() => {
    dispatch(getUsersAction());
  }, []);

  return (
    <div className="bg-white p-6">
      <header className="mb-8">
        <h1
          className="text-2xl font-medium"
          style={{ color: COLORS.DARKVIOLET }}
        >
          User & Role Management
        </h1>
        <p className="text-sm" style={{ color: COLORS.NEUTRALGRAY }}>
          Manage user accounts, roles, and permissions to streamline access
          control across your platform.
        </p>
      </header>

      <UserHeader users={users} />

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
            onDelete={handleDeleteClick}
          />
        ))}
      </section>

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteReason("");
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        showReason
        reason={deleteReason}
        onReasonChange={setDeleteReason}
      />

      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UserManagement;
