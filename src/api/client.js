/**
 * Minimal axios-based API client singleton.
 * Full interceptor stack (auth, refresh, error normalization) belongs to Task 3.
 * This stub only performs the request and unwraps `response.data` so services
 * can call `this.client.get(path)` and receive the payload directly.
 *
 * @module api/client
 */

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

const instance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Thin wrapper that unwraps axios response payloads.
 */
export const apiClient = {
  /**
   * @param {string} path
   * @param {import('axios').AxiosRequestConfig} [config]
   */
  async get(path, config) {
    const res = await instance.get(path, config);
    return res.data;
  },
  /**
   * @param {string} path
   * @param {unknown} [body]
   * @param {import('axios').AxiosRequestConfig} [config]
   */
  async post(path, body, config) {
    const res = await instance.post(path, body, config);
    return res.data;
  },
  /**
   * @param {string} path
   * @param {unknown} [body]
   * @param {import('axios').AxiosRequestConfig} [config]
   */
  async put(path, body, config) {
    const res = await instance.put(path, body, config);
    return res.data;
  },
  /**
   * @param {string} path
   * @param {unknown} [body]
   * @param {import('axios').AxiosRequestConfig} [config]
   */
  async patch(path, body, config) {
    const res = await instance.patch(path, body, config);
    return res.data;
  },
  /**
   * @param {string} path
   * @param {import('axios').AxiosRequestConfig} [config]
   */
  async delete(path, config) {
    const res = await instance.delete(path, config);
    return res.data;
  },
  raw: instance,
};
