export const DBNAME = "StudyMate"
export const questionTypes = ["Yes_no", "Write_sign", "Match_sign", "Sign_to_text", "Choose_correct_sign"]
export const questionLevels = ["beginner", "intermediate", "advanced"]
export const userChatEventsEnum = {
    'CONNECTED_EVENT': "connected",
    'DISCONNECTED_EVENT': "disconnected",
    'JOINED_ALBUM_CHAT_EVENT': "joinedAlbumChat",
    'LEFT_ALBUM_CHAT_EVENT': "leftAlbumChat",
    'SENT_MESSAGE_EVENT': "sentMessage",
    'RECEIVED_MESSAGE_EVENT': "receivedMessage",
    'SENT_REACTION_EVENT': "sentReaction",
    'RECEIVED_REACTION_EVENT': "receivedReaction",
    'SENT_TYPING_EVENT': "sentTyping",
    'RECEIVED_TYPING_EVENT': "receivedTyping",
    'MESSAGE_DELETED_EVENT': "messageDeleted",
    'MESSAGE_EDITED_EVENT': "messageEdited",
}
