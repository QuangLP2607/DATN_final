export interface Media {
  _id: string;
  id: string;
  file_name: string;
  file_key: string;
  file_type: string;
  file_size: number;
  uploaded_by: string | null;
  createdAt: string;
  updatedAt: string;
  url: string;
}
