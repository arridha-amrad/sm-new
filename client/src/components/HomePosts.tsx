import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import PostCard from '../features/post/PostCard';
import { selectPostState, setPosts } from '../features/post/postSlice';
import useSWR from 'swr';
import queryKey from '../utils/queryKey';
import fetcher from '../utils/swrFetcher';
import MySpinner from './MySpinner';

const HomePosts = () => {
  const { posts, isFetchingPosts } = useAppSelector(selectPostState);
  const dispatch = useAppDispatch();

  const { data } = useSWR(posts.length === 0 ? queryKey.posts : null, fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setPosts(data.posts));
    }
    // eslint-disable-next-line
  }, [data]);

  if (isFetchingPosts) {
    return <MySpinner />;
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
