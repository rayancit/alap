import React, { useEffect, useState } from "react";
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
const FriendList = () => {
  const db = getDatabase();
  const currentUser = useSelector((state) => state.userLoginInfo.userLoginInfo);
  const friendRef = ref(db, "friends/");
  const userRef = ref(db, "users/");
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    onValue(friendRef, (snapshot) => {
      let friends = [];
      snapshot.forEach((friend) => {
        friends.push({ ...friend.val(), key: friend.key });
      });
      setFriends(friends);
    });
    onValue(userRef, (snapshot) => {
      let users = [];
      snapshot.forEach((user) => {
        users.push(user.val());
      });
      setUsers(users);
    });
  }, []);
  const handleBlock = (userId, name, photoURL, key) => {
    set(push(ref(db, "blocks/")), {
      myId: currentUser.uid,
      blockId: userId,
      name,
      photoURL,
    }).then(() => {
      remove(ref(db, `friends/${key}`));
    });
  };
  const handleUnfriend = (key) => {
    remove(ref(db, `friends/${key}`));
  };
  return (
    <Card messageShow={true} title={"friend list"}>
      {users?.map((user) =>
        friends?.map((friend, index) =>
          friend.myId === currentUser.uid && friend.friendId === user.userId ? (
            <People
              key={index}
              messageShow={false}
              name={friend.name}
              photoURL={friend.photoURL}
            >
              <button
                key={index}
                className="py-3 px-8 bg-black text-white rounded-lg ml-auto"
                onClick={() => handleUnfriend(friend.key)}
              >
                unfriend
              </button>
              <button
                key={index}
                className="py-3 px-8 bg-red-600 text-white rounded-lg ml-auto"
                onClick={() =>
                  handleBlock(
                    friend.friendId,
                    friend.name,
                    friend.photoURL,
                    friend.key
                  )
                }
              >
                block
              </button>
            </People>
          ) : (
            friend.myId === user.userId &&
            friend.friendId === currentUser.uid && (
              <People
                key={index}
                messageShow={false}
                name={friend.myName}
                photoURL={friend.myPhotoURL}
              >
                <button
                  key={index}
                  className="py-3 px-8 bg-red-600 text-white rounded-lg ml-auto"
                  onClick={() =>
                    handleBlock(
                      friend.myId,
                      friend.myName,
                      friend.myPhotoURL,
                      friend.key
                    )
                  }
                >
                  unfriend
                </button>
                <button
                  key={index}
                  className="py-3 px-8 bg-red-600 text-white rounded-lg ml-auto"
                  onClick={() =>
                    handleBlock(
                      friend.myId,
                      friend.myName,
                      friend.myPhotoURL,
                      friend.key
                    )
                  }
                >
                  block
                </button>
              </People>
            )
          )
        )
      )}
    </Card>
  );
};

export default FriendList;
