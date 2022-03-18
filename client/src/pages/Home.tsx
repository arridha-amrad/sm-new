import { Container } from "react-bootstrap";
import Navbar from "../components/AppBar";
import HomeProfile from "../components/HomeProfile";
import HomePosts from "../components/HomePosts";
import PostMaker from "../features/post/CreatePostFeature";
import { ToastContainer } from "react-toastify";
import "./style.css";

const Home = () => {
  return (
    <>
      <Navbar />
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
    </>
  );
};

export default Home;
