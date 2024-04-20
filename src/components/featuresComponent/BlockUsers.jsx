import React, { useState, useEffect } from "react";
import Card from "../Card";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import People from "../People";
const BlockUsers = () => {
  const db = getDatabase();
  const currentUser = useSelector((state) => state.userLoginInfo.userLoginInfo);
  const BlockRef = ref(db, "blocks/");
  const [blocks, setBlocks] = useState([]);
  useEffect(() => {
    onValue(BlockRef, (snapshot) => {
      let blocks = [];
      snapshot.forEach((block) => {
        blocks.push({ ...block.val(), key: block.key });
      });
      setBlocks(blocks);
    });
  }, []);
  const handleUnBlock = (key)=>{
    remove(ref(db, `blocks/${key}`));
  }
  return (
    <Card messageShow={false} title={"block list"}>
      {blocks?.map(
        (block, index) => (
          block.myId === currentUser.uid && (
            <People
              key={index}
              messageShow={false}
              name={block.name}
              photoURL={block.photoURL}
            >
              <button
                key={index}
                className="py-3 px-8 bg-green-600 text-white rounded-lg ml-auto"
                onClick={() =>
                  handleUnBlock(
                    block.key
                  )
                }
              >
                unblock
              </button>
            </People>
          )
        )
      )}
    </Card>
  );
};

export default BlockUsers;
