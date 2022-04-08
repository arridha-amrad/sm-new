import { Container } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ChatHeader from "../components/Chats/ConversationHeader";
import Conversations from "../components/Chats/Conversations";
import Messages from "../components/Chats/Messages";
import {
  addMessage,
  resetSelectedConversation,
  selectChatState,
} from "../features/chats/chatSlice";
import CreateChat from "../features/chats/SendMessageFeature";
import SearchUserFeature from "../features/chats/SearchUserFeature";
import { useEffect } from "react";
import { getSocket } from "../mySocket";

import "./style.css";
import { ToastContainer } from "react-toastify";

const ChatPage = () => {
  const { selectedConversation } = useAppSelector(selectChatState);
  const dispatch = useAppDispatch();
  const socket = getSocket();

  useEffect(() => {
    dispatch(resetSelectedConversation());
  }, []);

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
              className="d-flex justify-content-center align-items-center bg-primary"
              style={{ height: "60px" }}
            >
              <SearchUserFeature />
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
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          closeButton={false}
          icon={false}
          theme="colored"
        />
      </Container>
    </section>
  );
};

export default ChatPage;
