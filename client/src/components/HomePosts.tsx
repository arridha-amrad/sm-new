import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PostCard from "../features/post/PostCard";
import { getPostsAction, selectPostState } from "../features/post/postSlice";

const HomePosts = () => {
  const { posts, isFetchingPosts } = useAppSelector(selectPostState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPostsAction());
    // eslint-disable-next-line
  }, []);

  if (isFetchingPosts) {
    return <p>loading...</p>;
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
