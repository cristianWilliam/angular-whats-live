import { User } from "../users/user.model";

export interface LocalUserImage extends User {
  imageBlob: Blob | null
};