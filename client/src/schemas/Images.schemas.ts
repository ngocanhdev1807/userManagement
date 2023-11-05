interface ImageType {
  _id?: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  result?: {
    url: string;
    type: number;
  }[];
}
export default class Image {
  _id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  result: {
    url: string;
    type: number;
  }[];
  constructor({ _id, user_id, created_at, updated_at, result }: ImageType) {
    const date = new Date();
    this._id = _id || "";
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
    this.user_id = user_id;
    this.result = result || [];
  }
}
