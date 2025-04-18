import axiosInstance from "../axiosConfig";

export const getUsersService = async () => {
  try {
    const response = await axiosInstance.get(`/user-management/users`);
    return response.data;
  } catch {
    throw new Error("Error: Getting user all session");
  }
};

export const createUserService = async (payload) => {
  try {
    const response = await axiosInstance.post("/user/createUser", payload);
    return response.data;
  } catch {
    throw new Error("Error: Creating new user");
  }
};

export const getDeleteUserService = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `/user/deleteUser/${payload.id}`,
      payload.obj
    );
    return response.data;
  } catch {
    throw new Error("Error: Getting user all session");
  }
};