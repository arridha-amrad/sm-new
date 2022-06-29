import { FC } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post } from '../../features/post/IPost';

interface IProps {
  post: Post;
}

const PostImages: FC<IProps> = ({ post }) => {
  return (
    <>
      {post.images.length > 0 && (
        <div className="overflow-hidden d-flex justify-content-center bg-black bg-opacity-10">
          <Carousel interval={null}>
            {post.images.map((image, index) => (
              <Carousel.Item key={index}>
                <Link to="/post/detail">
                  <img
                    className=" img-fluid rounded"
                    style={{
                      width: 'auto',
                      height: '100%',
                      maxHeight: '700px',
                      objectFit: 'fill',
                    }}
                    src={image}
                    alt="post"
                  />
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}
    </>
  );
};

export default PostImages;
