/* eslint-disable @next/next/no-img-element */
"use client";
import axiosCustom, { AxiosCustom } from "@/utils/axiosCustom.utils";
import { useMutation } from "@tanstack/react-query";
import map from "lodash/map";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { parseISO, format } from "date-fns";
import forEach from "lodash/forEach";
import User from "@/schemas/User.schema";
import { addToDate } from "@/utils/time.utils";

const PORT = 8000;
const SERVER_WebSocket_URL = `ws://localhost:${PORT}/user`;

interface FormInputs {
  verify: Record<string, boolean>;
  check90days: Record<string, boolean>;
  check60days: Record<string, boolean>;
  checkItem: Record<string, boolean>;
  ten: Record<string, string>;
}

export default function UserAdmin() {
  const [data, setData] = useState<User[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [itemCheckStatus, setItemCheckStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const { control, handleSubmit } = useForm<FormInputs>();

  const check90daysMutation = useMutation({
    mutationFn: (body: { _id: string; check90days: boolean; date: string }) =>
      axiosCustom.post({ url: "users/check90days", body }),
  });
  const handleCheck90daysChange = async ({
    check90days,
    _id,
    date,
  }: {
    check90days: boolean;
    _id: string;
    date: string;
  }) => {
    try {
      await check90daysMutation.mutateAsync({
        _id: _id,
        check90days: check90days,
        date: date ? new Date().toISOString() : "",
      });
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const checkVerifyMutation = useMutation({
    mutationFn: (body: { _id: string; check: number }) =>
      axiosCustom.post({ url: "users/checkerverify", body }),
  });
  const handleVerifyChange = async ({
    _id,
    checkVerify,
  }: {
    _id: string;
    checkVerify: boolean;
  }) => {
    console.log({
      checkVerify,
      _id,
    });
    try {
      await checkVerifyMutation.mutateAsync({
        _id,
        check: checkVerify ? 1 : 0,
      });
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const check60daysMutation = useMutation({
    mutationFn: (body: {
      _id: string;
      name: string;
      date: string;
      timestamp: number;
      check60days: boolean;
    }) => axiosCustom.post({ url: "users/check60days", body }),
  });
  const handleCheck60daysChange = async ({
    _id,
    name,
    date,
    timestamp,
    check60days,
  }: {
    _id: string;
    name: string;
    date: boolean;
    timestamp: number;
    check60days: boolean;
  }) => {
    try {
      await check60daysMutation.mutateAsync({
        _id: _id,
        name: name,
        date: date
          ? new Date().toISOString()
          : String(
              addToDate({
                initialDate: new Date(),
                timeToAdd: "60d",
              }).toISOString()
            ),
        timestamp: timestamp
          ? new Date().getTime()
          : addToDate({ initialDate: new Date(), timeToAdd: "60d" }).getTime(),
        check60days: check60days,
      });
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const deleteUserMutation = useMutation({
    mutationFn: (_id: string) =>
      axiosCustom.delete({ url: `users/deleteUser/${_id}` }),
  });
  const handleDeleteUser = async ({ _id }: { _id: string }) => {
    console.log("id", _id);
    await deleteUserMutation.mutateAsync(_id);
  };

  const deleteSelectedUsersMutation = useMutation({
    mutationFn: (selectedUserIds: string[]) => {
      console.log("Deleting Selected User Ids:", selectedUserIds);
      return axiosCustom.delete({
        url: `users/deleteManyUsers/${selectedUserIds.join(",")}`,
      });
    },
  });
  const handleDeleteAll = async () => {
    const selectedUserIds = Object.keys(itemCheckStatus).filter(
      (id) => itemCheckStatus[id]
    );
    await deleteSelectedUsersMutation.mutateAsync(selectedUserIds);
    setItemCheckStatus({});
    setCheckAll(false);
  };

  useEffect(() => {
    const ws = new WebSocket(SERVER_WebSocket_URL);

    ws.onopen = (e) => {
      console.log("Connected to the server");
    };

    ws.onclose = () => {};

    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    forEach(data, (value, key) => {
      if (value instanceof FileList) {
        forEach(value, (file, index) => {
          // Explicitly cast value to any or unknown
          formData.append(`${key}[${index}]`, file as any);
          // Alternatively: formData.append(`${key}[${index}]`, file as unknown);
        });
      } else {
        // Explicitly cast value to any or unknown
        formData.append(key, value as any);
        // Alternatively: formData.append(key, value as unknown);
      }
    });

    // Now you can log or send the formData as needed
    console.log(formData);
  });

  const handleCheckItem = async ({
    _id,
    index,
    checkItem,
  }: {
    _id: string;
    index: number;
    checkItem: boolean;
  }) => {
    console.log({
      checkItem,
      _id,
      index,
    });

    const updatedItemCheckStatus = {
      ...itemCheckStatus,
      [_id]: checkItem,
    };

    setItemCheckStatus(updatedItemCheckStatus);

    // Check if all items are checked, update checkAll accordingly
    const allItemsChecked = Object.values(updatedItemCheckStatus).every(
      Boolean
    );
    // setCheckAll(allItemsChecked);

    // Check if the item being updated is the first one
    const isFirstItem = data.length > 0 && data[index]._id === _id;

    // Update checkAll only if the item being updated is not the first one
    if (!isFirstItem) {
      setCheckAll(allItemsChecked);
    }

    if (Object.keys(updatedItemCheckStatus).length === data.length) {
      setCheckAll(allItemsChecked);
    }
  };

  const handleCheckAllToggle = () => {
    const updatedItemCheckStatus = {} as Record<string, boolean>;
    const newCheckAll = !checkAll;

    forEach(data, (item) => {
      updatedItemCheckStatus[item._id] = newCheckAll;
    });

    setItemCheckStatus(updatedItemCheckStatus);
    setCheckAll(newCheckAll);
  };

  const handleUploadButtonClick = (itemId: string) => {
    const fileInput = document.getElementById(`ten.${itemId}`);
    fileInput?.click();
  };

  const handleFileChange = async (files: FileList | null, _id: string) => {
    let linkFiles;

    if (files && files.length > 0) {
      const formData = new FormData();
      forEach(files, (file) => {
        formData.append("image", file);
      });

      try {
        await new AxiosCustom({
          create: {
            baseURL: "http://localhost:8000/",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        })
          .post({
            url: "users/upload-files",
            body: formData,
          })
          .then((res) => (linkFiles = res.data.result));
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
    await new AxiosCustom({
      create: {
        baseURL: "http://localhost:8000/",
        headers: {
          "Content-Type": "application/json",
        },
      },
    }).post({
      url: "users/update-link-files",
      body: {
        _id,
        linkFiles,
      },
    });
  };

  return (
    <div>
      <title>User Admin</title>
      <section className="container mx-auto p-6 font-mono">
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <form noValidate onSubmit={onSubmit} encType="multipart/form-data">
              <table className="w-full">
                <thead>
                  <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <th className="px-4 py-3">
                      <span className="flex items-center mt-1">
                        <input
                          type="checkbox"
                          checked={checkAll}
                          onChange={handleCheckAllToggle}
                          className="form-checkbox h-5 w-5 text-blue-500"
                        />
                      </span>
                    </th>
                    <th className="px-4 py-3">Tên</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">SĐT</th>
                    <th className="px-4 py-3"> Status</th>
                    <th className="px-4 py-3">Xác Thực</th>
                    <th className="px-4 py-3">Device</th>
                    <th className="px-4 py-3">Ngày Tạo</th>
                    <th className="px-4 py-3">Check 90 ngày</th>
                    <th className="px-4 py-3">Upload Image bổ sung</th>
                    <th className="px-4 py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {map(data, (item, idx: number) => {
                    return (
                      <tr key={item._id} className="text-gray-700">
                        <td className="px-4 py-3 text-ms font-semibold border">
                          <span className="flex items-center mt-1">
                            <Controller
                              name={`checkItem.${item._id}`}
                              control={control}
                              defaultValue={false}
                              render={({ field }) => (
                                <input
                                  type="checkbox"
                                  checked={itemCheckStatus[item._id] || false}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    field.onChange(isChecked);
                                    handleCheckItem({
                                      _id: item._id,
                                      checkItem: isChecked,
                                      index: idx,
                                    });
                                  }}
                                  className="form-checkbox h-5 w-5 text-blue-500"
                                />
                              )}
                            />
                          </span>
                        </td>
                        <td className="px-4 py-3 border">
                          <div className="flex items-center text-sm">
                            <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                              <img
                                className="object-cover w-full h-full rounded-full"
                                src={item.avatar}
                                alt=""
                                loading="lazy"
                              />
                              <div
                                className="absolute inset-0 rounded-full shadow-inner"
                                aria-hidden="true"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-black">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {item.job}
                              </p>
                            </div>
                          </div>
                          <br />
                          <div className="animate-gradient">
                            {(item as any)?.time_thoigianthuc?.calculateDate ===
                            "Có thể chỉnh sửa"
                              ? "Có thể chỉnh sửa"
                              : `Còn ${
                                  (item as any)?.time_thoigianthuc
                                    ?.calculateDate
                                } mới có thể chỉnh sửa tên`}
                          </div>
                          <span className="flex items-center mt-1">
                            <Controller
                              name={`check60days.${item._id}`}
                              control={control}
                              defaultValue={item.check.checkSixtyDays}
                              render={({ field }) => {
                                return (
                                  <>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      id={`check60days.${item._id}`}
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleCheck60daysChange({
                                          _id: item._id,
                                          name: item.name,
                                          date: e.target.checked,
                                          timestamp: e.target.checked
                                            ? new Date().getTime()
                                            : 0,
                                          check60days: e.target.checked,
                                        });
                                      }}
                                      value={(field.value || "").toString()}
                                      className="form-checkbox h-5 w-5 text-blue-500"
                                    />
                                    <label
                                      htmlFor={`check60days.${item._id}`}
                                      className="ml-2"
                                    >
                                      {item.check.checkSixtyDays
                                        ? "Đã mở khóa"
                                        : "Đang khóa"}
                                    </label>
                                  </>
                                );
                              }}
                            />
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ms font-semibold border">
                          {item.email}
                        </td>
                        <td className="px-4 py-3 text-ms border">
                          {item.phone}
                        </td>
                        <td className="px-4 py-3 text-ms border">
                          {item.check.checkStatus.isCheck
                            ? "Online"
                            : "Offline"}
                        </td>

                        <td className="px-4 py-3 text-xs border">
                          <span
                            className={`flex items-center px-2 py-1 font-semibold leading-tight ${
                              item.verify === 1
                                ? "text-green-700"
                                : "text-orange-700"
                            } bg-green-100 rounded-sm`}
                          >
                            <Controller
                              name={`verify.${item._id}`}
                              control={control}
                              defaultValue={item.verify === 1}
                              render={({ field }) => {
                                return (
                                  <>
                                    <input
                                      type="checkbox"
                                      id={`verify.${item._id}`}
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                        handleVerifyChange({
                                          _id: item._id,
                                          checkVerify: e.target.checked,
                                        });
                                      }}
                                      value={field.value.toString()}
                                      className="form-checkbox h-5 w-5 text-blue-500"
                                    />
                                    <label
                                      htmlFor={`verify.${item._id}`}
                                      className="ml-5"
                                    >
                                      {field.value === true
                                        ? "Đã xác thực"
                                        : "Chưa xác thực"}
                                    </label>
                                  </>
                                );
                              }}
                            />
                          </span>
                        </td>
                        {/* device */}
                        <td className="px-4 py-3 text-sm border">
                          {(item.device as any).device && (
                            <>
                              <span>
                                Trình duyệt:{" "}
                                {
                                  (item.device as any).uAParse
                                    ?.deviceUAParse_name
                                }
                              </span>
                              <br />
                              <span>
                                Phiên bản:{" "}
                                {
                                  (item.device as any).uAParse
                                    ?.deviceUAParse_engine_version
                                }
                              </span>
                              <br />
                              <span>
                                Tên thiết bị:{" "}
                                {(item.device as any).device?.hostname}
                              </span>
                              <br />
                              <span>
                                Hệ điều hành:{" "}
                                {(item.device as any).uAParse
                                  ?.deviceUAParse_os_name +
                                  " " +
                                  (item.device as any).uAParse
                                    ?.deviceUAParse_os_version}
                              </span>
                              <br />
                              <span>
                                Phiên bản: {(item.device as any).device?.osArch}
                              </span>
                              <br />
                              <span>
                                Thời điểm:{" "}
                                {format(
                                  parseISO(
                                    String((item.device as any).updated_at)
                                  ),
                                  "HH:mm:ss, dd/MM/yyyy"
                                )}
                              </span>
                            </>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border">
                          {item.created_at}
                        </td>
                        <td className="px-4 py-3 text-sm border">
                          <div className="animate-gradient">
                            {item.check.checkNinetyDays.isCheck === true ? (
                              <></>
                            ) : (
                              <>
                                {(item as any).check90days.calculateDate ===
                                "Khóa tài khoản"
                                  ? ""
                                  : `Còn ${
                                      (item as any).check90days.calculateDate
                                    }`}
                              </>
                            )}
                          </div>
                          <br />
                          <span className="flex items-center mt-1">
                            <Controller
                              name={`check90days.${item._id}`}
                              control={control}
                              defaultValue={
                                item?.check?.checkNinetyDays?.isCheck
                              }
                              render={({ field }) => {
                                return (
                                  <>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      id={`check90days.${item._id}`}
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleCheck90daysChange({
                                          _id: item._id,
                                          check90days: e.target.checked,
                                          date: e.target.checked
                                            ? ""
                                            : new Date().toISOString(),
                                        });
                                      }}
                                      value={field.value.toString()}
                                      className="form-checkbox h-5 w-5 text-blue-500"
                                    />
                                    <label
                                      htmlFor={`check90days.${item._id}`}
                                      className="ml-2"
                                    >
                                      {item?.check?.checkNinetyDays?.isCheck ===
                                      true
                                        ? "Tài Khoản đã được reset"
                                        : "Chưa khóa"}
                                    </label>
                                  </>
                                );
                              }}
                            />
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm border">
                          <div className="flex items-center">
                            {map(item?.images, (_item) => (
                              <div key={_item._id}>
                                <img
                                  className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                                  src={_item?.result[0].url}
                                  alt=""
                                />
                              </div>
                            ))}
                          </div>
                          <Controller
                            name={`ten.${item._id}`}
                            control={control}
                            render={({ field }) => (
                              <>
                                <input
                                  id={`ten.${item._id}`}
                                  className="hidden"
                                  type="file"
                                  multiple
                                  onChange={(e) => {
                                    field.onChange(e.target.files);
                                    handleFileChange(e.target.files, item._id);
                                  }}
                                />
                              </>
                            )}
                          />
                          <button
                            className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
                            type="button"
                            onClick={() => handleUploadButtonClick(item._id)}
                          >
                            Chọn Ảnh
                          </button>
                        </td>
                        <td className="px-4 py-3 text-ms border">
                          <button
                            type="button"
                            className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            data-ripple-light="true"
                            onClick={() => handleDeleteUser({ _id: item._id })}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button
                type="button"
                className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                onClick={handleDeleteAll}
              >
                Xóa Tất cả
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
