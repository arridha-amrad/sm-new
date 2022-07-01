import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthState } from '../../features/authentication/authSlice';
import { User } from '../../features/authentication/IAuthentication';
import {
  selectChatState,
  selectConversation,
} from '../../features/chats/chatSlice';
import { IConversation } from '../../features/chats/IChat';

import './style.css';

const SingleConversation: FC<{
  user: User;
  conversation: IConversation;
  conversationIndex: number;
}> = ({ user, conversation, conversationIndex }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAppSelector(selectAuthState);
  const { selectedReceiverId } = useAppSelector(selectChatState);
  const isSelected = user._id === selectedReceiverId;
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => {
        dispatch(
          selectConversation({
            ...conversation,
            receiverId: user._id,
            conversationIndex,
            receiverUsername: user.username,
          })
        );
        navigate(`${location.pathname}?id=${conversation._id}`);
      }}
      className={`${
        isSelected ? 'bg-gray' : ''
      } d-flex align-items-center conversation gap-3 p-3 chat-partner w-100`}
    >
      <img
        src={user.avatarURL}
        alt="avatar"
        className=" img-fluid rounded-circle"
        height="30px"
        width="30px"
      />
      <div
        style={{ position: 'relative' }}
        className="d-flex flex-column flex-grow-1 w-100"
      >
        <div>{user.username}</div>
        {conversation.lastMessage && (
          <div className="last-message">
            {conversation.lastMessage?.sender.username === loginUser?.username
              ? 'You'
              : conversation.lastMessage?.sender.username}{' '}
            :<span className=" ms-2">{conversation.lastMessage?.text}</span>
          </div>
        )}
        {conversation.totalUnreadMessage > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 0,
              top: 0,
              height: '20px',
              width: '20px',
              backgroundColor: 'red',
              color: '#fff',
              fontWeight: 'bolder',
              borderRadius: '50%',
            }}
          >
            {conversation.totalUnreadMessage > 0 &&
              conversation.totalUnreadMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleConversation;
