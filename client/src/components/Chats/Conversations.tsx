import { useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import { selectChatState } from "../../features/chats/chatSlice";
import SingleConversation from "./SingleConversation";

import "./style.css";

const Conversations = () => {
  const { conversations } = useAppSelector(selectChatState);
  const { loginUser } = useAppSelector(selectAuthState);

  return (
    <div className="w-100">
      {conversations.map((conversation, index) => (
        <SingleConversation
          key={index}
          conversationIndex={index}
          user={conversation.users.find((user) => user._id !== loginUser?._id)!}
          conversation={conversation}
        />
      ))}
    </div>
  );
};

export default Conversations;
