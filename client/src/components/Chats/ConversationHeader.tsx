import { FC, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import { Conversation } from "../../features/chats/IChat";
import { getSocket } from "../../mySocket";
import Conversations from "./Conversations";

import "./style.css";

interface Props {
  selectedConversation: Conversation;
}

const ConversationHeader: FC<Props> = ({ selectedConversation }) => {
  const socket = getSocket();
  const { loginUser } = useAppSelector(selectAuthState);
  const user = selectedConversation.users.find(
    (user) => user._id !== loginUser?._id
  );
  const [show, setShow] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    socket?.on("setTypingSC", ({ isTyping }) => {
      setIsTyping(isTyping);
    });
    // eslint-disable-next-line
  }, [socket]);

  return (
    <div className="d-flex h-100 p-1">
      <button onClick={handleShow} className="btn-toggle-conversation">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>

      <div className="d-flex flex-grow-1 h-100 flex-column align-items-center justify-content-center">
        <div className="d-flex align-items-start gap-2">
          <img
            className="rounded-circle"
            alt="avatar"
            src={user!.avatarURL}
            width="30px"
            height="30px"
          />
          <div className="d-flex flex-column">
            <div>{user!.username}</div>
            <small style={{ color: "#aaa" }}>{isTyping && "typing..."}</small>
          </div>
        </div>
      </div>

      <Modal fullscreen show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your Chats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Conversations />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ConversationHeader;
