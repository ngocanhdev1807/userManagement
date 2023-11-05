"use client";

import deviceUAParse from "@/utils/deviceUAParser.utils";
import { signIn } from "next-auth/react";
import React from "react";
import { useForm, type DefaultValues, Controller } from "react-hook-form";

interface LoginType {
  email: string;
  password: string;
}
const defaultValues: DefaultValues<LoginType> = {
  email: "",
  password: "",
};

export default function Login() {
  const { handleSubmit, control, watch } = useForm<LoginType>({
    defaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      deviceUAParse_name: deviceUAParse.result().uAParser.name,
      deviceUAParse_cpu_architecture:
        deviceUAParse.result().uAParser.cpu.architecture,
      deviceUAParse_engine_name: deviceUAParse.result().uAParser.engine.name,
      deviceUAParse_engine_version:
        deviceUAParse.result().uAParser.engine.version,
      deviceUAParse_os_name: deviceUAParse.result().uAParser.os.name,
      deviceUAParse_os_version: deviceUAParse.result().uAParser.os.version,
      deviceUAParse_ua: deviceUAParse.result().uAParser.ua,
      deviceUAParse_version: deviceUAParse.result().uAParser.version,
      redirect: true,
      callbackUrl: "/user",
    });
  });

  return (
    <>
      <title>Đăng nhập</title>
      <form noValidate onSubmit={onSubmit} className="mb-40 px-2">
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-cyan-300 to-sky-600 gap-1">
          <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
            <label className="text-gray-700">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => {
                return (
                  <input
                    type="text"
                    name="email"
                    className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Nhập Email"
                    onChange={field.onChange}
                    value={watch("email")}
                  />
                );
              }}
            />
            <label className="text-gray-700">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => {
                return (
                  <input
                    type="password"
                    name="password"
                    className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Nhập Password"
                    onChange={field.onChange}
                    value={watch("password")}
                  />
                );
              }}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
