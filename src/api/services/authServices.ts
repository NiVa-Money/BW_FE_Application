import axiosInstance from "../axiosConfig";

export const LoginUserService = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/user/login", payload);

    // Extract data from response.body
    const { user_id, token, orgName, roleName, moduleMap } = response.data.body;

    // Save to localStorage
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("token", token);
    localStorage.setItem("orgName", orgName);
    localStorage.setItem("roleName", roleName);
    localStorage.setItem("moduleMap", JSON.stringify(moduleMap));

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.error || "Login failed. Please try again.";
    throw new Error(errorMessage);
  }
};

export const SignUpUserService = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      "/user/signup/otherEmail",
      payload
    );
    return response.data;
  } catch (error: any) {
    return (
      error?.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );
  }
};

export const verifyOtpUserService = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      "/user/signup/verify/otherEmail",
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error("Error in verifying otp");
  }
};
//for google
export const LoginverifyGoogleLogin = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/user/signup", payload);

    // Extract data from response.body
    const { user_id, token, orgName, roleName, moduleMap } = response.data.body;

    // Save to localStorage
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("token", token);
    localStorage.setItem("orgName", orgName);
    localStorage.setItem("roleName", roleName);
    localStorage.setItem("moduleMap", JSON.stringify(moduleMap));

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.error || "Login failed. Please try again.";
    throw new Error(errorMessage);
  }
};

export const verifyGoogleUserService = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/user/signup/verify", payload);
    return response.data;
  } catch (error) {
    throw new Error("Error in verifying otp");
  }
};
export const getUserProfileService = async (payload: any) => {
  try {
    const response = await axiosInstance.get(
      `/user/getUserProfile?emailId=${payload}`
    );
    return response.data;
  } catch (error: any) {
    return (
      error?.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );
  }
};
