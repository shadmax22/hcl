import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000",
<<<<<<< HEAD
});

 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

 
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
=======
>>>>>>> ab719e8 (Seeding of Data)
});

 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

 
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
