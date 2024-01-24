import { User } from "./user.model";

export interface UserStorageInfo extends User {
  token: string
}