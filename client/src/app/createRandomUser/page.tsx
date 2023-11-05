"use client";
import axiosCustom from "@/utils/axiosCustom.utils";
import { useMutation } from "@tanstack/react-query";
import { Controller, DefaultValues, useForm } from "react-hook-form";

interface FormType {
  USER_COUNT: number;
  PASSWORD: string;
}
const defaultValues: DefaultValues<FormType> = {
  USER_COUNT: 0,
  PASSWORD: "",
};

export default function CreateRandomUser() {
  const { control, handleSubmit, watch } = useForm<FormType>({
    defaultValues,
  });
  const createRandomUserMutation = useMutation({
    mutationFn: (body: { USER_COUNT: number; PASSWORD: string }) =>
      axiosCustom.post({ url: "users/createRandomUser", body }),
  });

  const onSubmit = handleSubmit(async (data) => {
    const { PASSWORD, USER_COUNT } = data;
    console.log({ PASSWORD, USER_COUNT });
    try {
      await createRandomUserMutation.mutateAsync({
        USER_COUNT,
        PASSWORD,
      });
    } catch (error) {
      console.error("Error calling API:", error);
    }
  });
  return (
    <>
      <title>CreateRandomUser</title>
      <form noValidate onSubmit={onSubmit} className="mb-40 px-2">
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-cyan-300 to-sky-600 gap-1">
          <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
            <label className="text-gray-700">Số lượng user</label>
            <>
              <Controller
                name="USER_COUNT"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      <select
                        name="USER_COUNT"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        onChange={
                          (e) =>
                            field.onChange(parseInt(e.target.value, 10) || "") // chuyển từ string sang number
                        }
                        value={watch("USER_COUNT") || ""}
                      >
                        <option value="" disabled>
                          Chọn
                        </option>
                        {[
                          { value: "5", label: "5" },
                          { value: "10", label: "10" },
                          { value: "15", label: "15" },
                          { value: "20", label: "20" },
                        ].map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </>
                  );
                }}
              />
            </>
            <label className="text-gray-700">Mật khẩu</label>
            <>
              <Controller
                name="PASSWORD"
                control={control}
                render={({ field }) => {
                  return (
                    <input
                      type="password"
                      name="PASSWORD"
                      className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                      placeholder="Password"
                      onChange={field.onChange}
                      value={watch("PASSWORD")}
                    />
                  );
                }}
              />
            </>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              Bắt đầu tạo tài khoản
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
