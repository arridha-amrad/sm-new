import { FC } from "react";
import { SelectedPartner } from "../../features/chats/IChat";

interface Props {
  selectedPartner: SelectedPartner;
}

const ChatHeader: FC<Props> = ({ selectedPartner }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center border-bottom p-2">
      <div className="d-flex align-items-start gap-2">
        <img
          className="rounded-circle"
          alt="avatar"
          src={selectedPartner.avatarURL}
          width="30px"
          height="30px"
        />
        <div>{selectedPartner.username}</div>
      </div>
      <div>
        Chat id: <span>{selectedPartner.chatId}</span>
      </div>
    </div>
  );
};

export default ChatHeader;
