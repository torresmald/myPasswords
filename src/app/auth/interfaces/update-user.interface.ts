export interface UpdateUser {
  name: string;
  token: string;
  password: string;
  repeatPassword: string;
  image?: File;
}
