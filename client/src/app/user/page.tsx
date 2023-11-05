/* eslint-disable @next/next/no-img-element */
"use client";
import useApi, { Me } from "@/hooks/useApi";
import axiosCustom, { AxiosCustom } from "@/utils/axiosCustom.utils";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import Input from "@/components/Input/Input";
import InputNumber from "@/components/InputNumber/InputNumber";
import DateSelect from "@/components/DateSelect/DateSelect";
import Button from "@/components/Button/Button";
import InputFileImage from "@/components/InputFileImage/InputFileImage";
import map from "lodash/map";
import { addToDate, tinhKhoangThoiGian } from "@/utils/time.utils";
import find from "lodash/find";

const handleCheckStatusChange = async ({
  checkStatus,
  _id,
  date,
}: {
  checkStatus: boolean;
  _id?: string;
  date: string;
}) => {
  console.log({
    checkStatus,
    _id,
  });
  try {
    axiosCustom.post({
      url: "users/checkStatus",
      body: { _id, checkStatus, date },
    });
  } catch (error) {
    console.error("Error calling API:", error);
  }
};

const handleCheck90daysChange = async ({
  check90days,
  _id,
  date,
}: {
  check90days: boolean;
  _id?: string;
  date: string;
}) => {
  console.log({
    check90days,
    _id,
  });
  try {
    axiosCustom.post({
      url: "users/check90days",
      body: { _id, check90days, date },
    });
  } catch (error) {
    console.error("Error calling API:", error);
  }
};

const Info = ({ me, timeRes }: { me: Me; timeRes: any }) => {
  console.log(me?.result.time_thoigianthuc.calculateDate);
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext<{
    name?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    avatar?: string | undefined;
    gioitinh?: string | undefined;
    date_of_birth?: Date | undefined;
  }>();

  return (
    <Fragment>
      <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
        <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
          Tên
        </div>
        <div className="sm:w-[80%] sm:pl-5">
          <Input
            classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
            register={register}
            name="name"
            placeholder="Tên"
            timer={
              timeRes?.time_thoigianthuc?.calculateDate === undefined
                ? ""
                : timeRes?.time_thoigianthuc?.calculateDate === "NaN:NaN:NaN"
                ? "Bạn đã khóa chức năng chỉnh sửa tên (nếu muốn thay đổi ngay bây giờ, vui lòng liên hệ quản trị viên)"
                : `Còn ${timeRes?.time_thoigianthuc?.calculateDate} mới có thể chỉnh sửa tên (nếu muốn thay đổi ngay bây giờ, vui lòng liên hệ quản trị viên)`
            }
          />
        </div>
      </div>

      <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
        <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
          Giới tính
        </div>
        <div className="sm:w-[80%] sm:pl-5">
          <Controller
            name="gioitinh"
            control={control}
            render={({ field }) => {
              return (
                <>
                  <select
                    name="gioitinh"
                    className="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    onChange={field.onChange}
                    value={getValues("gioitinh")}
                  >
                    <option value="" disabled>
                      Giới Tính
                    </option>
                    {map(
                      [
                        { value: "male", label: "Nam" },
                        { value: "female", label: "Nữ" },
                        { value: "other", label: "Không xác định" },
                      ],
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </>
              );
            }}
          />
        </div>
      </div>
      {/*  */}
      <div className="mt-8 flex flex-col flex-wrap sm:flex-row">
        <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
          Số điện thoại
        </div>
        <div className="sm:w-[80%] sm:pl-5">
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <InputNumber
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                placeholder="Số điện thoại"
                errorMessage={errors.phone?.message}
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default function User() {
  const { data: session } = useSession();
  const { me } = useApi();
  const [file, setFile] = useState<File>();
  const [timeRes, setTimeRes] = useState({});
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);

  const methods = useForm<{
    name?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    avatar?: string | undefined;
    gioitinh?: string | undefined;
    date_of_birth?: Date | undefined;
  }>({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      avatar: "",
      gioitinh: "",
      date_of_birth: new Date(1990, 0, 1),
    },
  });
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = methods;

  const avatar = watch("avatar");

  useEffect(() => {
    if (me) {
      setValue("name", me.result.name || "");
      setValue("phone", me.result.phone || "");
      setValue("address", me.result.address || "");
      setValue("avatar", me.result.avatar || "");
      setValue("gioitinh", me.result.gioitinh || "");
      setValue(
        "date_of_birth",
        me.result.date_of_birth
          ? new Date(me.result.date_of_birth)
          : new Date(1990, 0, 1)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, setValue]);

  console.log("session", session);

  const onSubmit = handleSubmit(async (data) => {
    let linkAvatar: string | any = avatar; // trả về link ảnh
    if (file) {
      const form = new FormData();
      form.append("image", file);
      await Promise.all([
        (session as any)?.access_token &&
          new AxiosCustom({
            create: {
              baseURL: "http://localhost:8000/",
              headers: {
                Authorization: `Bearer ${(session as any).access_token}`,
                "Content-Type": "multipart/form-data",
              },
            },
          })
            .post({ url: "users/upload-avatar", body: form })
            .then((res) => (linkAvatar = res.data.result[0]?.url)),
      ]);
    }

    await Promise.all([
      (session as any)?.access_token &&
        new AxiosCustom({
          create: {
            baseURL: "http://localhost:8000/",
            headers: {
              Authorization: `Bearer ${(session as any).access_token}`,
              "Content-Type": "application/json",
            },
          },
        }).patch({
          url: "users/me",
          body: {
            ...data,
            avatar: linkAvatar,
          },
        }),
    ]);
  });

  const handleChangeFile = (file?: File) => {
    setFile(file);
  };

  const findName = (searchName: string, dataArray: any[]) =>
    find(dataArray, { name: searchName });
  useEffect(() => {
    const calculateTimeRes = () => {
      const newTimeRes = {
        ...me?.result,
        nammes: map(me?.result.names, (item) => ({
          calculateDate: tinhKhoangThoiGian({
            hienTai: new Date().toISOString(),
            tuongLai: item.last_time?.stringDate as string,
            returnTimeEnd: "Có thể chỉnh sửa",
          }),
        })),
        time_thoigianthuc:
          {
            ...findName(me?.result.name as string, me?.result?.names as any),
            calculateDate:
              tinhKhoangThoiGian({
                hienTai: new Date().toISOString(),
                tuongLai: findName(
                  me?.result.name as string,
                  me?.result?.names as any
                )?.last_time?.stringDate as string,
                returnTimeEnd: "Có thể chỉnh sửa",
              }) === "NaN:NaN:NaN" && Number(me?.result?.names.length) === 3
                ? ""
                : tinhKhoangThoiGian({
                    hienTai: new Date().toISOString(),
                    tuongLai: findName(
                      me?.result.name as string,
                      me?.result?.names as any
                    )?.last_time?.stringDate as string,
                    returnTimeEnd: "Có thể chỉnh sửa",
                  }),
          } || {},
      };
      setTimeRes(newTimeRes);
    };
    const intervalId = setInterval(() => {
      calculateTimeRes();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [me?.result]);

  useEffect(() => {
    Promise.all([
      handleCheckStatusChange({
        _id: me?.result._id,
        checkStatus: true,
        date: "",
      }),
      handleCheck90daysChange({
        _id: me?.result._id,
        check90days: true,
        date: "",
      }),
    ]);

    // Sự kiện xảy ra khi trình duyệt thoát khỏi trang
    const handleBeforeUnload = () => {
      Promise.all([
        handleCheckStatusChange({
          _id: me?.result._id,
          checkStatus: false,
          date: new Date().toISOString(),
        }),
        handleCheck90daysChange({
          _id: me?.result._id,
          check90days: false,
          date: String(
            addToDate({
              initialDate: new Date(),
              timeToAdd: "90d",
            }).toISOString()
          ),
        }),
      ]);
    };

    // Đăng ký sự kiện
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Hủy đăng ký sự kiện khi component bị unmount (trang bị đóng)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [me?.result._id]);

  console.log(timeRes);
  return (
    <>
      <title>User</title>
      <div className="mb-[10rem]">
        <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20">
          <div className="border-b border-b-gray-200 py-6">
            <h1 className="text-lg font-medium capitalize text-gray-900">
              Thông tin tài khoản
            </h1>
            <div className="mt-1 text-sm text-gray-700">
              Bạn có thể chỉnh sửa thông tin tài khoản của mình ở đây
            </div>
          </div>
          <FormProvider {...methods}>
            <form
              className="mt-8 flex flex-col-reverse md:flex-row md:items-start"
              onSubmit={onSubmit}
              encType="multipart/form-data"
            >
              <div className="mt-6 flex-grow md:mt-0 md:pr-12">
                <div className="flex flex-col flex-wrap sm:flex-row">
                  <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
                    Email
                  </div>
                  <div className="sm:w-[80%] sm:pl-5">
                    <div className="pt-3 text-gray-700">
                      {me?.result?.email}
                    </div>
                  </div>
                </div>
                <Info me={me as Me} timeRes={timeRes} />
                <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
                  <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
                    Địa chỉ
                  </div>
                  <div className="sm:w-[80%] sm:pl-5">
                    <Input
                      classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                      register={register}
                      name="address"
                      placeholder="Địa chỉ"
                      errorMessage={errors.address?.message}
                    />
                  </div>
                </div>
                <Controller
                  control={control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <DateSelect
                      errorMessage={errors.date_of_birth?.message}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <div className="flex flex-col flex-wrap sm:flex-row">
                  <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
                    Tình trạng tài khoản
                  </div>
                  <div className="sm:w-[80%] sm:pl-5">
                    <div className="pt-3 text-gray-700">
                      {me?.result?.verify === 0 ? "Unveryfy" : "Veryfy"}
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
                  <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
                  <div className="sm:w-[80%] sm:pl-5">
                    <Button
                      className="flex h-9 items-center rounded-sm bg-cyan-500 px-5 text-center text-sm text-white hover:bg-orange/80"
                      type="submit"
                    >
                      Lưu
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:w-72 md:border-l md:border-l-gray-200">
                <div className="flex flex-col items-center">
                  <div className="my-5 h-24 w-24">
                    <img
                      // src={previewImage || getAvatarUrl(avatar)}
                      src={previewImage || avatar}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <InputFileImage onChange={handleChangeFile} />
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
