import { FC, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastOptions } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAuthState } from '../../../features/authentication/authSlice';
import { User } from '../../../features/authentication/IAuthentication';
import {
  addConversation,
  selectChatState,
  selectConversation,
} from '../../../features/chats/chatSlice';
import SearchResultCard from '../SearchResultCard';

interface IProps {
  result: User[];
  closeModal(): void;
}

const toastOptions: ToastOptions = {
  position: 'bottom-center',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
};

const SearchResult: FC<IProps> = ({ result, closeModal }) => {
  const { loginUser } = useAppSelector(selectAuthState);
  const { conversations } = useAppSelector(selectChatState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const pickUser = (user: User) => {
    console.log('user : ', user);

    if (loginUser!._id !== user._id) {
      const existingConversation = conversations.find((c) =>
        c.users.find((u) => u._id === user._id)
      );
      console.log('existing conversation : ', existingConversation);

      if (existingConversation) {
        console.log('conv exists');
        const index = conversations.findIndex(
          (c) => c._id === existingConversation._id
        );
        dispatch(
          selectConversation({
            ...existingConversation,
            receiverId: user._id,
            receiverUsername: user.username,
            conversationIndex: index,
          })
        );
        navigate(`${location.pathname}?id=${existingConversation._id}`);
      } else {
        console.log('conv not exists');

        dispatch(
          addConversation({
            users: [user, loginUser!],
            isGroup: false,
            totalUnreadMessage: 0,
          })
        );
      }
    } else {
      toast.error('You cannot chat with your account', toastOptions);
    }
    closeModal();
  };
  return (
    <>
      {result.length === 0 ? (
        <div className="d-flex justify-content-center">
          <div>User not found</div>
        </div>
      ) : (
        result.map((user: User) => (
          <Fragment key={user._id}>
            <SearchResultCard pickUser={pickUser} user={user} />
          </Fragment>
        ))
      )}
    </>
  );
};

export default SearchResult;
