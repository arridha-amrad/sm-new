import { Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useFormHooks from "../../utils/useFormHooks";
import { createChat, selectChatState } from "./chatSlice";

const CreateChat = () => {
  const { selectedPartner } = useAppSelector(selectChatState);
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
    await dispatch(
      createChat({
        chatId: selectedPartner?.chatId ?? "",
        isGroup: false,
        message: state.message,
        receiverId: selectedPartner!._id,
      })
    );
  };
  const { onChange, onSubmit, state, isLoading } = useFormHooks(
    {
      message: "",
    },
    sendChat,
    checkField
  );

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="d-flex align-items-center border-top p-3"
      >
        <textarea
          className="chat-input"
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
    </div>
  );
};

export default CreateChat;
