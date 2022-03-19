import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";
import { Link } from "react-router-dom";
import LogoutButton from "../features/authentication/LogoutFeature";
import NotificationButton from "./Notification/NotificationButton";

const AppBar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
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
          <Nav className="me-auto d-flex align-items-center">
            <Link className=" text-decoration-none" to="/chats">
              Chats
            </Link>
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
