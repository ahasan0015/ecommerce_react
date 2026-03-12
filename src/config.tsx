
//update version for protected route
import axios from "axios";

// Base URLs
const baseApiUrl = "http://127.0.0.1:8000/api/"; // For API calls
const baseUrl = "http://127.0.0.1:8000/";        // Main website URL (if needed)

export { baseUrl }; // export main URL if you need it elsewhere

// Axios instance
const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor → add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login if token expired
    }
    return Promise.reject(error);
  }
);

export default api;



// //local
// const token = localStorage.getItem('token');




// const baseApiUrl ="http://127.0.0.1:8000/api/";
// const baseUrl ="http://127.0.0.1:8000/";

// export {baseUrl};

// const api = axios.create({
//     baseURL: baseApiUrl,
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization:`Bearer ${token}`
        
//     }
// });
// export default api;

//2nd one

// const baseApiUrl = "http://127.0.0.1:8000/api/";
// const baseUrl = "http://127.0.0.1:8000/";

// export { baseUrl };
// const api = axios.create({
//   baseURL: baseApiUrl,
//   headers: {
//     // "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });


// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); 
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;