export type UploadResponse = {
  type: `error`;
  error: string;
} | {
  type: `completed`;
  uploadPath: string;
};