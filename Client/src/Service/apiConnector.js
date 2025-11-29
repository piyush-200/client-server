import axios from "axios";

// Use environment variable for backend URL
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,
    url: url,  // only the route path, e.g., "/auth/login"
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};


