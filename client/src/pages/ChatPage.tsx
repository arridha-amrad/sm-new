import { Container } from "react-bootstrap";
import ChatPartners from "../components/Chats/ChatPartners";
import Chats from "../components/Chats/Chats";
import SearchUser from "../features/chats/SearchUserFeature";
import "./style.css";

const ChatPage = () => {
  return (
    <div style={{ marginTop: "4rem" }}>
      <Container>
        <div className="d-flex mt-5 flex-column mt-5 min-vh-100">
          <div className="flex-grow-1 border d-flex">
            <div className="w-25 border-end">
              <SearchUser />
              <ChatPartners />
            </div>
            <div className="w-100">
              <Chats />
            </div>
          </div>
          <div style={{ height: "80px" }} />
        </div>
      </Container>
    </div>
  );
};

export default ChatPage;
