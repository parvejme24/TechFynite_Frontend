// hooks/useAxiosSecure.ts

import { useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/Provider/AuthProvider";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5050/api/v1",
  withCredentials: true, // if using cookies (optional)
});

const useAxiosSecure = () => {
  const user = useContext(AuthContext)?.user;

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const token = await user?.getIdToken?.(); // Firebase JWT
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Axios error:", error?.response || error.message);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;
