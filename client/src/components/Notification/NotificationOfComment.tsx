import { FC, useEffect, useState } from "react";
import { User } from "../../features/authentication/IAuthentication";
import { INotification } from "../../features/notification/INotification";
import ChatIcon from "../../icons/ChatIcon";
import timeSetter from "../../utils/timeSetter";

interface Props {
  notification: INotification;
  type: "comment" | "reply" | "replyOfReply";
  loginUser: User;
}

const NotificationOfReply: FC<Props> = ({ notification, type, loginUser }) => {
  const [notif, setNotif] = useState({
    content: "",
    time: "",
    body: "",
    bodyTwo: "",
  });

  const setContent = () => {
    switch (type) {
      case "comment":
        return {
          content: "commented your post",
          bodyTwo: notification.comment?.body ?? "",
          body: notification.post?.body ?? "",
          time: timeSetter(
            new Date(notification.comment?.createdAt ?? new Date())
          ),
        };
      case "reply":
        return {
          content: "replied your comment",
          time: timeSetter(new Date(notification.reply!.createdAt)),
          body: notification.comment?.body ?? "",
          bodyTwo: notification.reply?.body ?? "",
        };
      case "replyOfReply":
        return {
          content: "replied your comment",
          time: timeSetter(new Date(notification.reply!.createdAt)),
          body: notification.reply?.body ?? "",
          bodyTwo: notification.replyTwo?.body ?? "",
        };
      default:
        return {
          time: "",
          body: "",
          bodyTwo: "",
          content: "",
        };
    }
  };

  useEffect(() => {
    const res = setContent();
    setNotif({ ...res });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="d-flex align-items-start p-3 gap-3">
      <div className="d-flex flex-column gap-2 align-items-center">
        <ChatIcon />
        <div className={notification.isOpen ? "" : "unseen bg-primary"} />
      </div>
      <div className="d-flex flex-column gap-1">
        <div>
          {notification.sender.username} {notif.content}
        </div>
        <small className="text-secondary">
          {timeSetter(new Date(notification.updatedAt))}
        </small>
        <div className="d-flex gap-3 ">
          <img
            src={loginUser?.avatarURL}
            alt="avatar"
            className="rounded-circle mt-2"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="d-flex flex-column align-items-start">
            <div>
              you
              <span className="ms-2">
                <small className="text-secondary">{notif.time}</small>
              </span>
            </div>
            <div>{notif.body}</div>
            <div className="d-flex align-items-start gap-2">
              <div className="mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-return-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"
                  />
                </svg>
              </div>
              <div className="d-flex gap-2 align-items-start mt-2">
                <img
                  src={notification.sender.avatarURL}
                  alt="avatar"
                  className="rounded-circle mt-1"
                  style={{ height: "20px", width: "20px" }}
                />
                <div className="d-flex flex-column align-items-start">
                  <small>
                    {notification.sender.username}
                    <span className="ms-2">
                      <small className="text-secondary">
                        {timeSetter(new Date(notification.updatedAt))}
                      </small>
                    </span>
                  </small>
                  <small>{notif.bodyTwo}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationOfReply;
