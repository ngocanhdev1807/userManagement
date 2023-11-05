import { Fragment, useRef } from "react";
import { toast } from "react-toastify";

const config = {
  maxSizeUploadAvatar: 1048576575687768769876976,
};

interface Props {
  onChange?: (files?: FileList) => void;
}

export default function InputFileImages({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = event.target.files;
    fileInputRef.current?.setAttribute("value", "");

    if (filesFromLocal) {
      let invalidFile = false;

      for (let i = 0; i < filesFromLocal.length; i++) {
        const file = filesFromLocal[i];

        if (
          file.size >= config.maxSizeUploadAvatar ||
          !file.type.includes("image")
        ) {
          toast.error(`Dụng lượng file tối đa 1 MB. Định dạng: .JPEG, .PNG`, {
            position: "top-center",
          });
          invalidFile = true;
          break;
        }
      }

      if (!invalidFile) {
        onChange && onChange(filesFromLocal);
      }
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Fragment>
      <input
        className="hidden"
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          (event.target as any).value = null;
        }}
        multiple // Enable multiple file selection
      />
      <button
        className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
        type="button"
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </Fragment>
  );
}

///////////////////////////////////////////////////////////
// import { Fragment, useRef } from "react";
// import { toast } from "react-toastify";

// interface Props {
//   onChange?: (files?: FileList) => void;
// }

// export default function InputFileImages({ onChange }: Props) {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const filesFromLocal = event.target.files;
//     fileInputRef.current?.setAttribute("value", "");

//     if (filesFromLocal) {
//       onChange && onChange(filesFromLocal);
//     }
//   };

//   const handleUpload = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <Fragment>
//       <input
//         className="hidden"
//         type="file"
//         accept=".jpg,.jpeg,.png"
//         ref={fileInputRef}
//         onChange={onFileChange}
//         onClick={(event) => {
//           (event.target as any).value = null;
//         }}
//         multiple // Enable multiple file selection
//       />
//       <button
//         className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
//         type="button"
//         onClick={handleUpload}
//       >
//         Chọn ảnh
//       </button>
//     </Fragment>
//   );
// }
