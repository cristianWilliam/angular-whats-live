import Dexie from "dexie";
import { from } from "rxjs";
import { LocalUserImage } from "./local-user-image.model";

export class LocalDb {
  private localDb = new Dexie('whats-local-live');
  private get userTable() {
    return this.localDb.table<LocalUserImage>('users');
  }
  
  constructor(){
    this.localDb.version(1)
      .stores({
        users: '&id, name, imageBlob'
      })
  }

  addUsers(users: LocalUserImage[]){
    return from(this.userTable.bulkPut(users));
  }
}