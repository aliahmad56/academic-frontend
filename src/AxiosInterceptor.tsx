import axios from "axios";

console.log("BASE_URL:", import.meta.env.VITE_APP_URL);
const Api = axios.create({ baseURL: import.meta.env.VITE_APP_URL });

const SECURE_API = axios.create({ baseURL: import.meta.env.VITE_APP_URL });
SECURE_API.interceptors.request.use(
  (config) => {
    const unParesdToken = localStorage.getItem("token");
    if (unParesdToken) {
      if (localStorage.getItem("isGuest") === "true") {
        console.log("Shit is real");
      } else {
        const tokenData = JSON.parse(atob(unParesdToken.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenData.exp && tokenData.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.clear();
          console.log("token has been expired");
          window.location.href = "/login";
        } else {
          config.headers.Authorization = `Bearer ${unParesdToken}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AxiosInterceptor = {
  SECURE_API,
  Api,
};

export default AxiosInterceptor;
