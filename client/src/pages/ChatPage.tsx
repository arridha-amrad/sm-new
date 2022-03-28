import { Container } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ChatHeader from "../components/Chats/ConversationHeader";
import Conversations from "../components/Chats/Conversations";
import Messages from "../components/Chats/Messages";
import { addMessage, selectChatState } from "../features/chats/chatSlice";
import CreateChat from "../features/chats/SendMessageFeature";
import CreateGroupChat from "../features/chats/CreateGroupChat";
import SearchUser from "../features/chats/SearchUserFeature";
import { useEffect } from "react";
import { getSocket } from "../mySocket";

import "./style.css";

const ChatPage = () => {
  const { selectedConversation } = useAppSelector(selectChatState);
  const dispatch = useAppDispatch();
  const socket = getSocket();

  useEffect(() => {
    socket?.on("sendMessageSC", (conversation, message) => {
      dispatch(
        addMessage({
          conversation,
          message,
        })
      );
    });
    // eslint-disable-next-line
  }, [socket]);

  return (
    <section className="chat-page">
      <Container>
        <div className="chat-page__container">
          <div className="sidebar border-end">
            <div
              className="d-flex align-items-center p-3 gap-2 border-bottom justify-content-center"
              style={{ height: "60px" }}
            >
              <SearchUser />
              <CreateGroupChat />
            </div>
            <Conversations />
          </div>
          {selectedConversation && (
            <>
              <div className="partner-info">
                <ChatHeader selectedConversation={selectedConversation} />
              </div>
              <div className="chats">
                <Messages />
              </div>
              <div className="chat-input">
                <CreateChat />
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
};

export default ChatPage;
