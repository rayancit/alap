import React from "react";
import Flex from "../components/layouts/Flex";
import { MdCancel } from "react-icons/md";
<MdCancel />;
const Modal = ({ children, onclose }) => {
  return (
    <Flex className="fixed top-0 left-0 z-50 items-center justify-center w-screen h-screen bg-black/50 ">
      <MdCancel className="text-3xl text-red-500" onClick={onclose} />
      {children}
    </Flex>
  );
};

export default Modal;
