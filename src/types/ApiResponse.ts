export enum ApiResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export interface ApiResponse<T> {
  status: ApiResponseStatus;
  data: T | null;
  error?: string | null;
}

export const buildSuccessfulApiResponse = <T>(
  data: T | null
): ApiResponse<T> => {
  return {
    status: ApiResponseStatus.SUCCESS,
    data,
    error: null,
  };
};

export const buildErrorApiResponse = <T>(
  error: string | null
): ApiResponse<T> => {
  return {
    status: ApiResponseStatus.ERROR,
    data: null,
    error,
  };
};
