import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PostCard from "../features/post/PostCard";
import { selectPostState, setPosts } from "../features/post/postSlice";
import axiosInstance from "../utils/axiosInterceptor";

const HomePosts = () => {
  const [loading, setLoading] = useState(true);
  const { posts } = useAppSelector(selectPostState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    const fetchPosts = async () => {
      const { data } = await axiosInstance.get("/api/post", {
        signal: controller.signal,
      });
      dispatch(setPosts(data.posts));
    };
    fetchPosts();
    isMounted && setLoading(false);
    return () => {
      controller.abort();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  if (loading) {
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
