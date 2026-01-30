import loadMessagesService from "./loadMessagesService";
import mediaService from "./mediaService";
import messageService from "./messageService";
import reactionService from "./reactionService";
import readService from "./readService";

export default {
  loadMessages: loadMessagesService,
  media: mediaService,
  message: messageService,
  reaction: reactionService,
  read: readService,
};
