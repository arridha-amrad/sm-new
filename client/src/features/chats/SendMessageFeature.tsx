import { Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useFormHooks from "../../utils/useFormHooks";
import {
  sendMessageAction,
  selectChatState,
  updateConversations,
} from "./chatSlice";
import "./style.css";

const CreateChat = () => {
  const { selectedConversation, selectedReceiverId, selectedReceiverUsername } =
    useAppSelector(selectChatState);
  const dispatch = useAppDispatch();

  const checkField = () => {
    let errors: { message?: string } = {};
    if (state.message.trim() === "") {
      errors.message = "Message is required";
    }
    return {
      isValid: Object.keys(errors).length > 0,
      errors,
    };
  };
  const sendChat = async () => {
    const res = await dispatch(
      sendMessageAction({
        conversationId: selectedConversation?._id,
        isGroup: selectedConversation?.isGroup ?? false,
        message: state.message,
        receiverId: selectedReceiverId!,
        toUsername: selectedReceiverUsername!,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      if (!selectedConversation?._id) {
        dispatch(
          updateConversations({
            ...res.payload.conversation,
            receiverId: selectedReceiverId,
          })
        );
      }
      setState({
        ...state,
        message: "",
      });
    }
  };
  const { onChange, onSubmit, state, isLoading, setState } = useFormHooks(
    {
      message: "",
    },
    sendChat,
    checkField
  );

  return (
    <form
      onSubmit={onSubmit}
      className="d-flex align-items-center border-top h-100 gap-3 p-3"
    >
      <textarea
        className="text-input"
        onChange={onChange}
        value={state.message}
        name="message"
        placeholder="write your message..."
      />
      <button
        onClick={sendChat}
        disabled={isLoading || !state.message}
        type="submit"
        className="btn btn-primary"
      >
        {isLoading ? <Spinner animation="border" /> : "Send"}
      </button>
    </form>
  );
};

export default CreateChat;
