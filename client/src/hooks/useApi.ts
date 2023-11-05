import { AxiosCustom } from "@/utils/axiosCustom.utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export type Me = {
  message: string;
  result: {
    _id?: string;
    name: string;
    names: {
      _id?: string;
      user_id: string;
      name: string;
      edits?: number;
      first_time?: {
        stringDate?: string;
        timestamp?: number;
      };
      last_time?: {
        stringDate?: string;
        timestamp?: number;
      };
      created_at?: Date;
      updated_at?: Date;
    }[];
    email: string;
    date_of_birth: Date;
    password: string;
    created_at: Date;
    updated_at: Date;
    email_verify_token: string; // jwt hoặc '' nếu đã xác thực email
    forgot_password_token: string; // jwt hoặc '' nếu đã xác thực email
    verify: number;
    twitter_circle: string[]; // danh sách id của những người user này add vào circle
    bio: string; // optional
    phone: string;
    address: string;
    location: string; // optional
    website: string; // optional
    username: string; // optional
    avatar: string; // optional
    gioitinh: string; // optional
    cover_photo: string; // optional
    devices?: {
      _id?: string;
      user_id: string;
      created_at?: Date;
      updated_at?: Date;
      os?: {
        hostname?: string;
        platform?: string;
        networkInfo?: any;
        osType?: string;
        osPlatform?: string;
        osArch?: string;
      };
      uAParser?: {
        name: string; // Chrome
        version: string; // 117.0.0.0
        cpu: { architecture: string }; // {architecture: 'amd64'}
        engine: { name: string; version: string }; // {name: 'Blink', version: '117.0.0.0'}
        os: { name: string; version: string }; // {name: 'Windows', version: '10'}
        ua: string; // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36
      };
    }[];
    time_thoigianthuc: {
      calculateDate: string;
      created_at: string;
      first_time: {
        stringDate: string;
        timestamp: number;
      };
      last_time: {
        stringDate: string;
        timestamp: number;
      };
      name: string;
      updated_at: string;
      _id: string;
    };
  };
};

export default function useApi() {
  const { data: session } = useSession();
  //////////////////////////// truyền access_token lên headers

  const [me, setMe] = useState<Me>();
  useEffect(() => {
    Promise.all([
      (session as any)?.access_token &&
        new AxiosCustom({
          create: {
            baseURL: "http://localhost:8000/",
            headers: {
              Authorization: `Bearer ${(session as any).access_token}`,
            },
          },
        })
          .get<Me>({ url: "users/me" })
          .then((res) => setMe(res.data)),
    ]);
  }, [session]);

  return { me };
}
