export interface UserApi {
  id: string;
  email: string;
  name: string,
  roles: string[];
  token: string;
  isValidUser: boolean;
  image?: File;
}
