import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PostCard from "./Post/PostCard";
import { selectPostState, setPosts } from "../features/post/postSlice";
import useSWR from "swr";
import queryKey from "../utils/queryKey";
import fetcher from "../utils/swrFetcher";
import MySpinner from "./MySpinner";
import { selectAuthState } from "../features/authentication/authSlice";

const HomePosts = () => {
  const { posts } = useAppSelector(selectPostState);
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  const { data, error } = useSWR(loginUser ? queryKey.posts : null, fetcher);

  useEffect(() => {
    if (data) {
      dispatch(setPosts(data.posts));
    }
    // eslint-disable-next-line
  }, [data]);

  if (!data && !error) {
    return (
      <div className="mt-5">
        <MySpinner isFullHeight={false} />
      </div>
    );
  }

  return (
    <>
      {posts.map((post, index) => (
        <PostCard key={post._id} post={post} stateIndex={index} />
      ))}
    </>
  );
};

export default HomePosts;
