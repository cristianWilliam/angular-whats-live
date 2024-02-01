import { Injectable } from "@angular/core";
import { forkJoin, map, switchMap } from "rxjs";
import { LocalDb } from "../local-db/local-db";
import { Conversation } from "./conversation.model";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private localDb = new LocalDb();

  createConversation(id: string, userName: string){
    return this.localDb
      .addConversation(id, userName);
  }

  listenConversations(){
    return this.localDb.getLiveConversations()
      .pipe(
        // Convertendo para cada conversation que eu tenho no banco, 
        // executando uma busca do blob de image para criar um Image URL.
        switchMap(conversations => {
          
          // Criando um array de requisicao de blob para cada user.
          const userImageBlobRequests = conversations
            .map(conversation => 
              
              // crio uma requisicao de blob de imagem na table user pelo userId.
              this.localDb
                .getUserImage(conversation.id)
                .pipe(
                  map(blob => ({
                    id: conversation.id,
                    userId: conversation.id,
                    userName: conversation.userName,
                    userImageUrl: !!blob ? URL.createObjectURL(blob) : null,
                  }) as Conversation)));

          return forkJoin(userImageBlobRequests);
        })
      )  
    ;
  }

  publishMessage(conversationUserId: string, message: string){
    this.localDb.saveMessage({
      time: new Date(),
      message: message,
      mine: true,
      conversationUserId: conversationUserId
    });
  }
}