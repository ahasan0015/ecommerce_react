import axios from "axios";


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

const baseApiUrl = "http://127.0.0.1:8000/api/";
const baseUrl = "http://127.0.0.1:8000/";

export { baseUrl };
const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;