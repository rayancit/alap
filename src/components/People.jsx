import React from "react";
import Flex from "./layouts/Flex";
import Img from "./layouts/Img";
const People = ({
  messageShow,
  photoURL,
  name,
  children,
  message,
  onActiveChat,
}) => {
  return (
    <div onClick={onActiveChat}>
      <Flex className={"items-center gap-x-4 mt-3  p-3  "}>
        <Img src={photoURL} className={"w-16 h-16 "} />
        <div>
          <h4 className="break-all w-36">{name}</h4>
          {messageShow && <small>{message}</small>}
        </div>
        {children}
      </Flex>
    </div>
  );
};

export default People;
