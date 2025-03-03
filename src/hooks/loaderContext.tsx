/* eslint-disable react-refresh/only-export-components */

import  {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
import axiosInstance from "../api/axiosConfig";
  
  interface LoaderContextProps {
    loading: boolean;
  }
  
  // Initialize the context as possibly undefined
  const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);
  
  interface LoaderProviderProps {
    children: ReactNode;
  }
  
  export const LoaderProvider = ({ children }: LoaderProviderProps) => {
    const [loading, setLoading] = useState<boolean>(false);
  
    useEffect(() => {
      const reqInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          setLoading(true);
          return config;
        },
        (error) => {
          setLoading(false);
          return Promise.reject(error);
        }
      );
  
      const resInterceptor = axiosInstance.interceptors.response.use(
        (response) => {
          setLoading(false);
          return response;
        },
        (error) => {
          setLoading(false);
          return Promise.reject(error);
        }
      );
  
      return () => {
        axiosInstance.interceptors.request.eject(reqInterceptor);
        axiosInstance.interceptors.response.eject(resInterceptor);
      };
    }, []);
  
    return (
      <LoaderContext.Provider value={{ loading }}>
        {children}
      </LoaderContext.Provider>
    );
  };
  
  export const useLoader = (): LoaderContextProps => {
    const context = useContext(LoaderContext);
    if (!context) {
      throw new Error("useLoader must be used within a LoaderProvider");
    }
    return context;
  };
  