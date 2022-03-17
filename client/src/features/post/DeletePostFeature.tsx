import { FC } from "react";
import Dropdown from "react-bootstrap/esm/Dropdown";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../app/hooks";
import { Post } from "./IPost";
import { deletePostAction } from "./postSlice";

interface Props {
  post: Post;
}
const DeletePostButton: FC<Props> = ({ post }) => {
  const dispatch = useAppDispatch();
  const deletePost = async () => {
    const res = await dispatch(deletePostAction(post));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Post deleted successfully", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
    if (res.meta.requestStatus === "rejected") {
      toast.error("Failed to delete the post", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };
  return (
    <Dropdown.Item className="bg-danger text-white" onClick={deletePost}>
      Delete Post
    </Dropdown.Item>
  );
};

export default DeletePostButton;
