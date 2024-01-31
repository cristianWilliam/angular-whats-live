import { User } from "./user.model";

export interface UserImage {
  user: User,
  imageUrl: string  | null
}