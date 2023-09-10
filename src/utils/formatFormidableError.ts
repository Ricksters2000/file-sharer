type FormidableError = {
  code: number;
  httpCode: number;
}

export const formatFormidableError = (error: FormidableError) => {
  switch (error.code) {
    case 1009:
      return `File too large to upload (max file size: 50mb)`;
    default:
      return error.toString();
  }
}