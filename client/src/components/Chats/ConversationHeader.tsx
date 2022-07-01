import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthState } from '../../features/authentication/authSlice';
import { resetSelectedConversation } from '../../features/chats/chatSlice';
import { IConversation } from '../../features/chats/IChat';
import { getSocket } from '../../socket/mySocket';

import './style.css';

interface Props {
  selectedConversation: IConversation;
}

const ConversationHeader: FC<Props> = ({ selectedConversation }) => {
  const socket = getSocket();
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const user = selectedConversation.users.find(
    (user) => user._id !== loginUser?._id
  );
  const [isTyping, setIsTyping] = useState(false);

  const [val] = useSearchParams();
  const cId = val.get('id');

  useEffect(() => {
    setIsTyping(false);
  }, [cId]);

  useEffect(() => {
    socket?.on('setTypingSC', ({ isTyping, chatId }) => {
      if (cId === chatId) {
        setIsTyping(isTyping);
      } else {
        setIsTyping(false);
      }
    });
    // eslint-disable-next-line
  }, [socket, cId]);

  return (
    <div className="d-flex h-100 p-1">
      <button
        onClick={() => dispatch(resetSelectedConversation())}
        className="btn-toggle-conversation rounded-circle h-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-chevron-left"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
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
            <small style={{ color: '#aaa' }}>{isTyping && 'typing...'}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
