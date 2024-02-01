export interface LocalConversationMessage {
  id?: number,
  conversationUserId: string,
  message: string,
  mine: boolean,
  time: Date
}