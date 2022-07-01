import { Container } from 'react-bootstrap';
import HomeProfile from '../components/HomeProfile';
import HomePosts from '../components/HomePosts';
import PostMaker from '../features/post/CreatePostFeature';
import { ToastContainer } from 'react-toastify';
import './style.css';
import { getSocket } from '../socket/mySocket';
import { useEffect } from 'react';

const Home = () => {
  const socket = getSocket();
  useEffect(() => {
    console.log('socket : ', socket);
  }, [socket]);
  return (
    <section className="home-page">
      <Container>
        <div className="grid-container">
          <div className="grid-item-1">
            <PostMaker />
            <HomePosts />
          </div>
          <div className="grid-item-2">
            <div className="home-profile">
              <HomeProfile />
            </div>
          </div>
        </div>
        <div className="mt-5"></div>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          closeButton={false}
          icon={false}
          theme="colored"
        />
      </Container>
    </section>
  );
};

export default Home;
