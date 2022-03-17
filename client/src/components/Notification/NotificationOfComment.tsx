import { FC } from "react";
import { User } from "../../features/authentication/IAuthentication";
import { INotification } from "../../features/notification/INotification";
import timeSetter from "../../utils/timeSetter";

interface Props {
  notification: INotification;
  type: "comment" | "reply";
  loginUser: User;
}

const NotificationOfReply: FC<Props> = ({ notification, type, loginUser }) => {
  const content =
    type === "comment" ? "commented your post" : "replied your comment";

  const setContentDate = () => {
    let result;
    if (type === "comment") {
      result = timeSetter(new Date(notification.comment!.createdAt));
    }
    if (type === "reply") {
      result = timeSetter(new Date(notification.reply!.createdAt));
    }
    return result;
  };

  const setContentBody = () => {
    let body;
    if (type === "comment") {
      body = notification.post?.body;
    }
    if (type === "reply") {
      body = notification.comment?.body;
    }
    return body;
  };
  return (
    <div className="d-flex align-items-start p-3 gap-3">
      <div className="d-flex flex-column gap-2 align-items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-chat-right-quote"
            viewBox="0 0 16 16"
          >
            <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
            <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
          </svg>
        </div>
        <div className={notification.isOpen ? "" : "unseen"} />
      </div>
      <div className="d-flex flex-column gap-1">
        <div>
          {notification.sender.username} {content}
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
                <small className="text-secondary">{setContentDate()}</small>
              </span>
            </div>
            <div>{setContentBody()}</div>
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
                  <small>
                    {type === "comment"
                      ? notification.comment?.body
                      : notification.reply?.body}
                  </small>
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
