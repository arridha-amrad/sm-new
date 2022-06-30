import { FC, useEffect, useState } from "react";
import { User } from "../../features/authentication/IAuthentication";
import { INotification } from "../../features/notification/INotification";
import timeSetter from "../../utils/timeSetter";

interface Props {
  notification: INotification;
  typeOfLike: "post" | "comment" | "reply";
  loginUser: User;
}

const NotificationOfLike: FC<Props> = ({
  notification,
  typeOfLike,
  loginUser,
}) => {
  const [notif, setNotif] = useState({
    time: "",
    body: "",
  });

  const setContent = () => {
    switch (typeOfLike) {
      case "comment":
        return {
          time: timeSetter(new Date(notification.comment!.createdAt)),
          body: notification.comment?.body,
        };
      case "post":
        return {
          time: timeSetter(new Date(notification.post!.createdAt)),
          body: notification.post?.body,
        };
      case "reply":
        return {
          time: timeSetter(new Date(notification.reply!.createdAt)),
          body: notification.reply?.body,
        };
      default:
        return {
          time: "",
          body: "",
        };
    }
  };

  useEffect(() => {
    const { time, body } = setContent();
    setNotif({
      body: body!,
      time,
    });
  }, [notification]);

  return (
    <div className="d-flex gap-3 align-items-start p-3">
      <div className="d-flex flex-column gap-2 align-items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#db19d2"
            className="bi bi-heart-fill"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
            />
          </svg>
        </div>
        <div className={notification.isOpen ? "" : "unseen"} />
      </div>
      <div className="d-flex flex-column gap-1">
        <div className="d-flex flex-column justify-content-start align-items-start">
          <div>
            {notification.sender.username} like your {typeOfLike}
          </div>
          <small className=" text-secondary">
            {timeSetter(new Date(notification.updatedAt))}
          </small>
        </div>

        <div className="d-flex align-items-start gap-3">
          <div>
            <img
              src={loginUser.avatarURL}
              alt="avatar"
              className="rounded-circle mt-2"
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <div className="d-flex flex-column align-items-start">
            <div>
              you
              <span className="ms-2">
                <small className="text-secondary">{notif.time}</small>
              </span>
            </div>
            <div>{notif.body}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationOfLike;
