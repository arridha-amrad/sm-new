import { useAppSelector } from "../../app/hooks";
import { selectChatState } from "../../features/chats/chatSlice";
import timeSetter from "../../utils/timeSetter";

const Chats = () => {
  const { selectedPartner } = useAppSelector(selectChatState);
  return (
    <div className="d-flex flex-column w-100 h-100">
      <div className="flex-grow-1 d-flex flex-column p-3">
        <div
          style={{ maxWidth: "400px" }}
          className="p-3 gap-4 rounded align-self-end my-2 bg-pink"
        >
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            pariatur amet explicabo autem distinctio accusamus omnis nam nulla,
            nostrum praesentium.
          </div>
          <small className="d-block text-secondary text-nowrap text-end">
            {timeSetter(new Date())}
          </small>
        </div>
        <div
          style={{ maxWidth: "400px" }}
          className="d-flex align-items-start border p-3 gap-4 rounded align-self-end my-2"
        >
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            pariatur amet explicabo autem distinctio accusamus omnis nam nulla,
            nostrum praesentium.
          </div>
          <div className=" text-secondary  text-nowrap">
            {timeSetter(new Date())}
          </div>
        </div>
        <div
          style={{ maxWidth: "400px" }}
          className="d-flex align-items-start border p-3 gap-4 rounded align-self-start"
        >
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            pariatur amet explicabo autem distinctio accusamus omnis nam nulla,
            nostrum praesentium.
          </div>
          <div className=" text-secondary  text-nowrap">
            {timeSetter(new Date())}
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center border-top p-3">
        <textarea className="chat-input" placeholder="write your message..." />
        <button className="btn btn-primary">Send</button>
      </div>
    </div>
  );
};

export default Chats;
