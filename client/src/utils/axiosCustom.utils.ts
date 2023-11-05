import axios, { AxiosResponse, type AxiosInstance } from "axios";
// import { toPlainObject } from "lodash";

interface AxiosCustomType {
  create: {
    baseURL: string;
    timeout?: number;
    headers?: {
      "Content-Type"?: "application/json" | "multipart/form-data";
      Authorization?: string; // Add Authorization header
      // 'expire-access-token'?: number // 1 ngày
      // 'expire-refresh-token'?: number // 160 ngày
    };
  };
}

export class AxiosCustom {
  private create: {
    baseURL: string;
    timeout?: number;
    headers?: {
      "Content-Type"?: string;
      Authorization?: string; // Include Authorization property and make it optional
      // 'expire-access-token': number
      // 'expire-refresh-token': number
    };
  };

  private instance: AxiosInstance;

  constructor({ create }: AxiosCustomType) {
    //// private
    this.create = {
      baseURL: create.baseURL,
      timeout: (create && create.timeout) || 0,
      headers: create &&
        create.headers && {
          "Content-Type": create.headers["Content-Type"],
          Authorization: create.headers.Authorization,
        },
    };

    //// public
    this.instance = axios.create({
      baseURL: this.create.baseURL,
      timeout: this.create.timeout,
      headers: this.create.headers,
    });
  }

  public get = <T = any>({
    url,
    query_params,
  }: {
    url: string;
    query_params?: any;
  }): Promise<AxiosResponse<T>> => {
    return this.instance.get<T>(url, query_params);
  };

  public post = <T = any>({
    url,
    body,
    headers,
  }: {
    url: string;
    body?: any;
    headers?: any;
  }): Promise<AxiosResponse<T>> => {
    return this.instance.post<T>(url, body, headers);
  };

  public put = <T = any>({
    url,
    body,
  }: {
    url: string;
    body?: any;
  }): Promise<AxiosResponse<T>> => {
    return this.instance.put<T>(url, body);
  };

  public patch = <T = any>({
    url,
    body,
  }: {
    url: string;
    body?: any;
  }): Promise<AxiosResponse<T>> => {
    return this.instance.patch<T>(url, body);
  };

  public delete = <T = any>({
    url,
    body,
  }: {
    url: string;
    body?: any;
  }): Promise<AxiosResponse<T>> => {
    return this.instance.delete<T>(url, body);
  };
}
const axiosCustom = new AxiosCustom({
  create: {
    baseURL: "http://localhost:8000/",
    headers: { "Content-Type": "application/json" },
  },
});
export default axiosCustom;
