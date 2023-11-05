"use client";
import axiosCustom from "@/utils/axiosCustom.utils";
import { useMutation } from "@tanstack/react-query";
import { Controller, DefaultValues, useForm } from "react-hook-form";

interface FormType {
  collection: string[];
}
const defaultValues: DefaultValues<FormType> = {
  collection: [],
};

export default function DeleteCollection() {
  const { control, handleSubmit, watch } = useForm<FormType>({
    defaultValues,
  });

  const createDeleteCollectionMutation = useMutation({
    mutationFn: async (collections: string[]) => {
      const collectionsString = collections.join(",");
      await axiosCustom.delete({
        url: `users/deleteCollection/${collectionsString}`,
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await createDeleteCollectionMutation.mutateAsync(data.collection);
  });
  return (
    <>
      <title>DeleteCollection</title>
      <form noValidate onSubmit={onSubmit} className="mb-40 px-2">
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-cyan-300 to-sky-600 gap-1">
          <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
            <label className="text-gray-700">Nhập Collection</label>
            <>
              <Controller
                name="collection"
                control={control}
                render={({ field }) => {
                  return (
                    <input
                      type="text"
                      name="collection"
                      className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                      placeholder=""
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const collectionArray = inputValue
                          .split(",")
                          .map((item) => item.trim());
                        field.onChange(collectionArray);
                      }}
                      value={watch("collection")}
                    />
                  );
                }}
              />
            </>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              Bắt đầu xóa collection
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
