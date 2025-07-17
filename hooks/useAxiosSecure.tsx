import axios from "axios";
import { API_BASE_URL } from "@/lib/config";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Optionally, add an interceptor to attach a token from localStorage or cookies
instance.interceptors.request.use(
  (config) => {
    // Example: get token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAxiosSecure = () => {
  return instance;
};

export default useAxiosSecure;
