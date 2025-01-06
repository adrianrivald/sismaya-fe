import { http } from "src/utils/http";

interface UploadResponse {
  filename: string;
  path: string;
  url: string;
}

interface UploadBulkResponse {
  data: UploadResponse[]
}


export async function uploadImage(formData: FormData) {
  const { data: response } = await http<{ data: UploadResponse }>(
    'upload',
    {
      data: formData,
    }
  );

  return response;
}


export async function uploadFilesBulk(formData: FormData) {
  const response = await http<{ data: UploadResponse[] }>(
    'bulk-upload',
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    }
  );

  return response;
}
