export interface AuthRegisterResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    birthDate: string;
  };
  accessToken: string;
}
