import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthState } from '../../features/authentication/authSlice';
import { selectChatState, setMessages } from '../../features/chats/chatSlice';
import { Message } from '../../features/chats/IChat';

import timeSetter from '../../utils/timeSetter';

import './style.css';
import useSWR from 'swr';
import queryKeys from '../../utils/queryKey';
import fetcher from '../../utils/swrFetcher';
import MySpinner from '../MySpinner';
import { useSearchParams } from 'react-router-dom';

const Messages = () => {
  const { messages } = useAppSelector(selectChatState);
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);

  const [val] = useSearchParams();
  const chatId = val.get('id');

  const { data, error, isValidating } = useSWR(
    chatId ? `${queryKeys.messages}?conversationId=${chatId}` : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      dispatch(setMessages(data.messages));
    }
    // eslint-disable-next-line
  }, [data, error]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      outerContainerRef.current?.scroll({
        behavior: 'smooth',
        top: messagesContainerRef.current.scrollHeight,
      });
    }
  }, [messagesContainerRef.current?.scrollHeight]);

  useEffect(() => {
    outerContainerRef.current?.scroll({
      top: 0,
    });
  }, [chatId]);

  const isSentByMe = (message: Message) =>
    message.sender._id === loginUser?._id;

  if (isValidating) {
    return (
      <div className="d-flex h-100 w-100 align-items-center justify-content-center">
        <MySpinner isFullHeight={false} />
      </div>
    );
  }

  return (
    <div
      ref={outerContainerRef}
      className="d-flex flex-column h-100 w-100"
      style={{ overflow: 'auto' }}
    >
      <div ref={messagesContainerRef} className="d-flex flex-column my-2 mx-3">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message-container ${
              isSentByMe(message)
                ? 'bg-pink align-self-end'
                : 'border align-self-start'
            } p-3 gap-4 rounded my-2`}
          >
            <div className="message-body">{message.text}</div>
            <small className="d-block text-secondary text-nowrap text-end">
              {timeSetter(new Date(message.createdAt))}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
