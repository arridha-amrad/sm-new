import { FC, useState } from "react";
import { User } from "../../features/authentication/IAuthentication";

interface Props {
  pickUser: (user: User) => void;
  user: User;
}

const SearchCard: FC<Props> = ({ pickUser, user }) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div
      className={` ${
        isSelected ? "bg-purple-overlay" : ""
      } d-flex flex-column border my-3 p-3 rounded search search-card`}
      onClick={() => {
        setIsSelected((prev) => !prev);
        pickUser(user);
      }}
    >
      <div className="d-flex align-items-start gap-3">
        <img
          alt="avatar"
          src={user.avatarURL}
          width="30px"
          height="30px"
          className="img-fluid rounded-circle"
        />
        <div className="d-flex flex-column">
          <div>{user.username}</div>
          <div>{user.fullName}</div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
