import { useState } from "react";
import { Button } from "react-bootstrap";
import Toast from "react-bootstrap/esm/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";

const MyToast = () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <ToastContainer className="p-3" position="bottom-center">
        <Toast
          onClose={() => setIsShow(false)}
          show={isShow}
          className="bg-primary text-white"
          delay={3000}
          autohide
        >
          <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
        </Toast>
      </ToastContainer>
      <Button onClick={() => setIsShow(true)}>Click</Button>
    </>
  );
};

export default MyToast;
