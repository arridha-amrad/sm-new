import { FC } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";

import NotificationOfLike from "./NotificationOfLike";
import NotificationOfComment from "./NotificationOfComment";
import {
  INotification,
  NotificationType,
} from "../../features/notification/INotification";

interface Props {
  notification: INotification;
  notifIndex: number;
}

const NotificationCard: FC<Props> = ({ notification, notifIndex }) => {
  const { loginUser } = useAppSelector(selectAuthState);
  if (notification.type === NotificationType.LIKE_POST) {
    return (
      <NotificationOfLike
        loginUser={loginUser!}
        typeOfLike="post"
        notification={notification}
      />
    );
  }
  if (notification.type === NotificationType.COMMENT_POST) {
    return (
      <NotificationOfComment
        type="comment"
        loginUser={loginUser!}
        notification={notification}
      />
    );
  }
  if (notification.type === NotificationType.LIKE_COMMENT) {
    return (
      <NotificationOfLike
        loginUser={loginUser!}
        typeOfLike="comment"
        notification={notification}
      />
    );
  }
  if (notification.type === NotificationType.REPLY_COMMENT) {
    return (
      <NotificationOfComment
        type="reply"
        loginUser={loginUser!}
        notification={notification}
      />
    );
  }
  if (notification.type === NotificationType.REPLY_REPLY) {
    return (
      <NotificationOfComment
        type="replyOfReply"
        loginUser={loginUser!}
        notification={notification}
      />
    );
  }
  return (
    <NotificationOfLike
      loginUser={loginUser!}
      typeOfLike="reply"
      notification={notification}
    />
  );
};

export default NotificationCard;
