import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AuthResponse } from "../types";

const API_URL = (Constants.expoConfig?.extra?.apiUrl as string) ?? "http://localhost:4000/api";

export const api = axios.create({ baseURL: API_URL });

// Attach the access token to every outgoing request.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try once to refresh the token pair before giving up and forcing
// a logout. `_retry` prevents an infinite loop if the refresh itself fails.
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry && !isRefreshing) {
      original._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) throw error;

        const { data } = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);
