import { http } from '../http';

interface UploadImageResponse {
  filename: string;
  path: string;
  url: string;
}

interface UploadIllustrationResponse {
  data: UploadImageResponse;
  thumbnail: UploadImageResponse;
}

export async function uploadImage(formData: FormData) {
  const { data: response } = await http<{ data: UploadImageResponse }>(
    'upload/image',
    {
      data: formData,
    }
  );

  return response;
}

export async function uploadIllustrationImage(formData: FormData) {
  const response = await http<UploadIllustrationResponse>(
    'upload/illustration',
    {
      data: formData,
    }
  );

  return response;
}

type UploadIllustrationPreviewResponse = Pick<
  UploadIllustrationResponse,
  'data'
>;

export async function uploadIllustrationPreviewImage(formData: FormData) {
  const response = await http<UploadIllustrationPreviewResponse>(
    'upload/illustration-preview',
    {
      data: formData,
    }
  );

  return response;
}

export async function uploadBlogThumbnailImage(formData: FormData) {
  const response = await http<UploadIllustrationResponse>('upload/image/blog-thumbnail', {
    data: formData,
  });

  return response;
}

export async function uploadBlogMainImage(formData: FormData) {
  const response = await http<UploadIllustrationResponse>('upload/image/blog', {
    data: formData,
  });

  return response;
}
