import axios from "axios";
import axiosInstance, { publicBaseUrl } from "../axiosConfig";

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

export const editUserService = async (payload) => {
  try {
    const response = await axiosInstance.post("/user/updateUser", payload);
    return response.data;
  } catch {
    throw new Error("Error: Updating user");
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

export const getUserDetails = async (payload) => {
  try {
    const response = await axios.get(
      `${publicBaseUrl}/user/getUserById?userId=${payload.userId}`
    );
    return response.data;
  } catch {
    throw new Error("Error: Fetching User Details");
  }
};
export const resendOtp = async (payload) => {
  try {
    const response = await axios.post(`${publicBaseUrl}/resend-otp`, payload);
    return response.data;
  } catch {
    throw new Error("Error: Sending OTP on Mail");
  }
};
export const verifyOtp = async (payload) => {
  try {
    const response = await axios.post(
      `${publicBaseUrl}/user-management/verifyCreateUserOtp`,
      payload
    );
    return response.data;
  } catch {
    throw new Error("Error: Verifying OTP");
  }
};
export const setPassword = async (payload) => {
  try {
    const response = await axios.post(
      `${publicBaseUrl}/user/set-password`,
      payload
    );
    return response.data;
  } catch {
    throw new Error("Error: Setting Password");
  }
};
