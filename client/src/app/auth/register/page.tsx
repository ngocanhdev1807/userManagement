"use client";
import { useForm, type DefaultValues, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axiosCustom from "@/utils/axiosCustom.utils";
import range from "lodash/range";
import map from "lodash/map";
import moment from "moment";

interface RegisterType {
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: Date;
  gioitinh: string;
  ho: string;
  ten: string;
}
const defaultValues: DefaultValues<RegisterType> = {
  email: "",
  password: "",
  confirm_password: "",
  date_of_birth: new Date(1990, 0, 1),
  gioitinh: "",
  ho: "",
  ten: "",
};

export default function Register() {
  const { handleSubmit, control, watch } = useForm<RegisterType>({
    defaultValues,
  });

  const registerAccountMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      axiosCustom.post({ url: "users/register", body }),
  });
  const onSubmit = handleSubmit(async (data) => {
    const { email, password, confirm_password, gioitinh } = data;
    const new_Date_of_birth = moment(
      data.date_of_birth,
      "ddd MMM DD YYYY HH:mm:ss ZZ"
    ).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const name = `${data.ho} ${data.ten}`;
    const body = {
      email,
      password,
      gioitinh,
      confirm_password,
      date_of_birth: new_Date_of_birth,
      name,
    };
    if (password === confirm_password) {
      registerAccountMutation.mutate(body);
    } else {
      console.log("Password không đúng nhập lại");
    }
  });
  //

  return (
    <>
      <title>Đăng ký</title>
      <form noValidate onSubmit={onSubmit} className="mb-40 px-2">
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-cyan-300 to-sky-600 gap-1">
          <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
            {/*  */}
            <span className="flex items-center ">
              <>
                <Controller
                  name="ho"
                  control={control}
                  render={({ field }) => {
                    return (
                      <input
                        type="text"
                        name="ho"
                        className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Họ"
                        onChange={field.onChange}
                        value={watch("ho")}
                      />
                    );
                  }}
                />
              </>
              <span className="ml-2">
                <Controller
                  name="ten"
                  control={control}
                  render={({ field }) => {
                    return (
                      <input
                        type="text"
                        name="ten"
                        className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Tên"
                        onChange={field.onChange}
                        value={watch("ten")}
                      />
                    );
                  }}
                />
              </span>
            </span>
            {/*  */}
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
            <label className="text-gray-700">Mật khẩu</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => {
                return (
                  <input
                    type="password"
                    name="password"
                    className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Nhập mật khẩu"
                    onChange={field.onChange}
                    value={watch("password")}
                  />
                );
              }}
            />
            <label className="text-gray-700">Nhập lại mật khẩu</label>
            <Controller
              name="confirm_password"
              control={control}
              render={({ field }) => {
                return (
                  <input
                    type="password"
                    name="confirm_password"
                    className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Nhập lại mật khẩu"
                    onChange={field.onChange}
                    value={watch("confirm_password")}
                  />
                );
              }}
            />
            {/*  */}
            <label className="text-gray-700">Ngày sinh</label>
            <Controller
              control={control}
              name="date_of_birth"
              render={({ field }) => (
                <div className="flex justify-between">
                  <select
                    onChange={(e) => {
                      const selectedDay = parseInt(e.target.value, 10);
                      const currentDate =
                        field.value || defaultValues.date_of_birth;
                      const updatedDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        selectedDay
                      );
                      field.onChange(updatedDate);
                    }}
                    name="day"
                    className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange"
                  >
                    <option value="" disabled>
                      Ngày
                    </option>
                    {range(1, 32).map((day) => (
                      <option value={day} key={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <select
                    onChange={(e) => {
                      const selectedMonth = parseInt(e.target.value, 10);
                      const currentDate =
                        field.value || defaultValues.date_of_birth;
                      const updatedDate = new Date(
                        currentDate.getFullYear(),
                        selectedMonth - 1,
                        currentDate.getDate()
                      );
                      field.onChange(updatedDate);
                    }}
                    name="month"
                    className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange"
                  >
                    <option value="" disabled>
                      Tháng
                    </option>
                    {range(1, 13).map((month) => (
                      <option value={month} key={month}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    onChange={(e) => {
                      const selectedYear = parseInt(e.target.value, 10);
                      const currentDate =
                        field.value || defaultValues.date_of_birth;
                      const updatedDate = new Date(
                        selectedYear,
                        currentDate.getMonth(),
                        currentDate.getDate()
                      );
                      field.onChange(updatedDate);
                    }}
                    name="year"
                    className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange"
                  >
                    <option value="" disabled>
                      Năm
                    </option>
                    {range(1990, 2024).map((year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
            {/*  */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Giới tính:
              </label>

              <div className="flex gap-2">
                <Controller
                  name="gioitinh"
                  control={control}
                  render={({ field }) => (
                    <>
                      {map(["female", "male"], (optionValue, index) => (
                        <div
                          key={index}
                          className="h-10 w-[50%] cursor-pointer rounded-sm border border-black/10 hover:border-orange flex items-center justify-between px-2"
                        >
                          <label
                            htmlFor={optionValue}
                            className="ml-2 text-sm font-medium text-gray-900"
                          >
                            {optionValue === "female" ? "Nữ" : "Nam"}
                          </label>
                          <input
                            id={optionValue}
                            value={optionValue}
                            type="radio"
                            onChange={(e) => field.onChange(e)}
                            checked={field.value === optionValue}
                            className="h-4 w-4 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
            </div>
            {/*  */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
