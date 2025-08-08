export type ApiResponse = {
  statusCode: number;
  title: string;
  message: string;
  expiredAccessToken?: boolean;
  expiredRenewToken?: boolean;
  accessUnauthorized?: boolean;
};
