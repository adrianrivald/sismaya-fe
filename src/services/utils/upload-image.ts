import { http } from "src/utils/http";

interface UploadImageResponse {
  filename: string;
  path: string;
  url: string;
}


export async function uploadImage(formData: FormData) {
  const { data: response } = await http<{ data: UploadImageResponse }>(
    'upload',
    {
      data: formData,
    }
  );

  return response;
}
