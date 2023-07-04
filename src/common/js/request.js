/* eslint-disable no-undef */

import axios from "axios";
import { message } from "antd";
import get from "lodash/get";

const request = axios.create({
  baseURL: "",
  headers: {},
  timeout: 10000,
  withCredentials: true,
});

request.interceptors.request.use((config) => {
  // todo
  return config;
});

request.interceptors.response.use(
  (response) => {
    /**
     * loading
     */
    const res = get(response, "data");
    if (![0, 200].includes(res.code)) message.warning(res.message);
    return res;
  },
  (error) => {
    console.error(error);
    message.error(error.message);
  }
);

export default request;
