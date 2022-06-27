import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import {
  selectChatState,
  setConversations,
} from "../../features/chats/chatSlice";
import queryKeys from "../../utils/queryKey";
import fetcher from "../../utils/swrFetcher";
import MySpinner from "../MySpinner";
import SingleConversation from "./SingleConversation";

import "./style.css";

const Conversations = () => {
  const { conversations } = useAppSelector(selectChatState);
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const { data, error } = useSWR(queryKeys.conversations, fetcher);

  useEffect(() => {
    if (data) {
      dispatch(setConversations(data.conversations));
    }
    if (data || error || conversations.length > 0) {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <div className="w-100">
      {loading && <MySpinner />}
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
