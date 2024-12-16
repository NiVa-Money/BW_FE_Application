import axiosInstance from "../axiosConfig";


export const LoginUserService = async (payload: any) => {
    try {
      const response = await axiosInstance.post('/user/login', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`${error?.response?.data?.error}`);
    }
  };


  export const SignUpUserService = async (payload: any) => {
    try {
      const response = await axiosInstance.post('/user/signup/otherEmail', payload);
      return response.data; 
    } catch (error: any) {
      return error?.response?.data || { success: false, message: "Something went wrong." };
    }
  };
  

  export const verifyOtpUserService = async (payload: any) => {
    try {
      const response = await axiosInstance.post(
        '/user/signup/verify/otherEmail',
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error('Error in verifying otp');
    }
  };

  



