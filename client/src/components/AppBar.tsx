import { useEffect, useState } from "react";
import Badge from "react-bootstrap/esm/Badge";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import LogoutButton from "../features/authentication/LogoutFeature";
import { selectChatState } from "../features/chats/chatSlice";
import NotificationButton from "./Notification/NotificationButton";

const AppBar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { conversations } = useAppSelector(selectChatState);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  const totalUnreadMessage = conversations.reduce(
    (prevValue, currValue) => prevValue + currValue.totalUnreadMessage,
    0
  );

  return (
    <Navbar
      className={scrollPosition > 10 ? "shadow-sm" : ""}
      fixed="top"
      bg="light"
      expand="lg"
    >
      <Container>
        <Navbar.Brand as={"div"}>
          <Link to="/" className="text-decoration-none">
            Social Media
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto d-flex align-items-center position-relative">
            <Link className=" text-decoration-none" to="/chats">
              Chats
            </Link>
            {totalUnreadMessage !== 0 && (
              <Badge
                className=" position-absolute"
                style={{ right: "-25px", bottom: "10px" }}
                pill
                bg="danger"
              >
                {totalUnreadMessage}
              </Badge>
            )}
          </Nav>
          <Nav className="d-flex gap-5">
            <NotificationButton />
            <LogoutButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppBar;
