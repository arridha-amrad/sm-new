import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import ChatHeader from "../components/Chats/ChatHeader";
import ChatPartners from "../components/Chats/ChatPartners";
import Chats from "../components/Chats/Chats";
import { selectChatState } from "../features/chats/chatSlice";
import CreateChat from "../features/chats/CreateChatFeature";
import CreateGroupChat from "../features/chats/CreateGroupChat";
import SearchUser from "../features/chats/SearchUserFeature";
import "./style.css";

const ChatPage = () => {
  const { selectedPartner } = useAppSelector(selectChatState);
  return (
    <div style={{ overflowY: "hidden", marginTop: "4rem" }}>
      <Container>
        <div className="chat-page__container">
          <div className="sidebar">
            <div
              className="d-flex align-items-center p-3 gap-2 border-bottom"
              style={{ height: "60px" }}
            >
              <SearchUser />
              <CreateGroupChat />
            </div>
            <ChatPartners />
          </div>
          <div className="partner-info"></div>
          <div className="chats"></div>
          <div className="chat-input"></div>
        </div>
      </Container>
    </div>
  );
};

export default ChatPage;

{
  /* <div className="d-flex flex-column w-100">
<div className="flex-grow-1 border d-flex">
  <div className="w-25 border-end">
    <SearchUser />
  </div>
  <div className="w-100">
    {selectedPartner && (
      <div className="d-flex flex-column h-100">
        <ChatHeader selectedPartner={selectedPartner} />
        <Chats />
        <CreateChat />
      </div>
    )}
  </div>
</div>
</div> */
}
