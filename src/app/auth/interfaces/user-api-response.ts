export interface UserApi {
  id:          string;
  email:       string;
  roles:       string[];
  token:       string;
  isValidUser: boolean;
}
