import axios from "axios";
import {
  apiBaseUrl,
  apiIntegrationKey,
} from "../../config/constants/apiConfig";

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    apikey: apiIntegrationKey,
  },
});

export default api;
