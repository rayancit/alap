import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../Card";
import People from "../People";
const UserList = () => {
  const db = getDatabase();
  const currentUser = useSelector((state) => state.userLoginInfo.userLoginInfo);
  const userRef = ref(db, "users/");
  const friendRequestRef = ref(db, "friendRequests/");
  const friendRef = ref(db, "friends/");
  const blockRef = ref(db, "blocks/");
  const [users, setUsers] = useState(null);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    onValue(userRef, (snapshot) => {
      let users = [];
      snapshot.forEach((user) => {
        users.push(user.val());
      });
      setUsers(users);
    });
    onValue(friendRequestRef, (snapshot) => {
      let friendRequests = [];
      snapshot.forEach((friendRequest) => {
        friendRequests.push({
          key: friendRequest.key,
          value: friendRequest.val(),
        });
      });
      setFriendRequests(friendRequests);
    });

    onValue(friendRef, (snapshot) => {
      let friend = [];
      snapshot.forEach((friends) => {
        friend.push(friends.val().friendId + friends.val().myId);
      });
      setFriends(friend);
    });
    onValue(blockRef, (snapshot) => {
      let blocks = [];
      snapshot.forEach((block) => {
        blocks.push(block.val().blockId + block.val().myId);
      });
      setBlocks(blocks);
    });
  }, []);
  const handleFriendRequest = (recId, name, photoURL) => {
    set(push(ref(db, "friendRequests/")), {
      senId: currentUser.uid,
      recId,
      name,
      photoURL,
    });
  };
  const handleFriendRequestCancel = (key) => {
    console.log(key);
    remove(ref(db, `friendRequests/${key}`));
  };
  const handleAddFriend = (userId, name, photoURL, key) => {
    set(push(ref(db, "friends/")), {
      myId: currentUser.uid,
      myName: currentUser.displayName,
      myPhotoURL: currentUser.photoURL,
      friendId: userId,
      name,
      photoURL,
    }).then(() => {
      remove(ref(db, `friendRequests/${key}`));
      handleFriendRequestCancel(key);
    });
  };
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value) {
      let searchedUsers = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchedUsers(searchedUsers);
    } else {
      setSearchedUsers([]);
    }
  };
  return (
    <Card
      messageShow={true}
      title={"user list"}
      onSearch={handleSearch}
      searchValue={searchValue}
    >
      {searchedUsers.length > 0
        ? searchedUsers?.map(
            (user, index) =>
              user.userId !== currentUser.uid &&
              !(
                friends?.includes(user.userId + currentUser.uid) ||
                friends?.includes(currentUser.uid + user.userId)
              ) &&
              !(
                blocks?.includes(user.userId + currentUser.uid) ||
                blocks?.includes(currentUser.uid + user.userId)
              ) && (
                <People
                  key={index}
                  messageShow={false}
                  name={user.name}
                  photoURL={user.photoURL}
                >
                  {friendRequests?.length > 0 ? (
                    friendRequests.map((friendRequest) =>
                      friendRequest.value.senId === currentUser.uid &&
                      friendRequest.value.recId === user.userId ? (
                        <button
                          key={friendRequest.key}
                          className="px-8 py-3 ml-auto text-white bg-red-600 rounded-lg"
                          onClick={() =>
                            handleFriendRequestCancel(friendRequest.key)
                          }
                        >
                          cancel
                        </button>
                      ) : friendRequest.value.recId === currentUser.uid &&
                        friendRequest.value.senId === user.userId ? (
                        <>
                          <button
                            key={friendRequest.key}
                            className="px-8 py-3 ml-auto text-white bg-blue-600 rounded-lg"
                            onClick={() =>
                              handleAddFriend(
                                user.userId,
                                user.name,
                                user.photoURL,
                                friendRequest.key
                              )
                            }
                          >
                            accept
                          </button>
                          <button
                            key={friendRequest.key}
                            className="px-8 py-3 ml-auto text-white bg-red-600 rounded-lg"
                            onClick={() =>
                              handleFriendRequestCancel(friendRequest.key)
                            }
                          >
                            cancel
                          </button>
                        </>
                      ) : (
                        <button
                          // key={friendRequest.key}
                          className="px-8 py-3 ml-auto text-white bg-purple-600 rounded-lg"
                          onClick={() =>
                            handleFriendRequest(
                              user.userId,
                              user.name,
                              user.photoURL
                            )
                          }
                        >
                          join
                        </button>
                      )
                    )
                  ) : (
                    <button
                      // key={friendRequest.key}
                      className="px-8 py-3 ml-auto text-white bg-purple-600 rounded-lg"
                      onClick={() =>
                        handleFriendRequest(
                          user.userId,
                          user.name,
                          user.photoURL
                        )
                      }
                    >
                      join
                    </button>
                  )}
                </People>
              )
          )
        : users?.map(
            (user, index) =>
              user.userId !== currentUser.uid &&
              !(
                friends?.includes(user.userId + currentUser.uid) ||
                friends?.includes(currentUser.uid + user.userId)
              ) &&
              !(
                blocks?.includes(user.userId + currentUser.uid) ||
                blocks?.includes(currentUser.uid + user.userId)
              ) && (
                <People
                  key={index}
                  messageShow={false}
                  name={user.name}
                  photoURL={user.photoURL}
                >
                  {friendRequests?.length > 0 ? (
                    friendRequests.map((friendRequest) =>
                      friendRequest.value.senId === currentUser.uid &&
                      friendRequest.value.recId === user.userId ? (
                        <button
                          key={friendRequest.key}
                          className="px-8 py-3 ml-auto text-white bg-red-600 rounded-lg"
                          onClick={() =>
                            handleFriendRequestCancel(friendRequest.key)
                          }
                        >
                          cancel
                        </button>
                      ) : friendRequest.value.recId === currentUser.uid &&
                        friendRequest.value.senId === user.userId ? (
                        <>
                          <button
                            key={friendRequest.key}
                            className="px-8 py-3 ml-auto text-white bg-blue-600 rounded-lg"
                            onClick={() =>
                              handleAddFriend(
                                user.userId,
                                user.name,
                                user.photoURL,
                                friendRequest.key
                              )
                            }
                          >
                            accept
                          </button>
                          <button
                            key={friendRequest.key}
                            className="px-8 py-3 ml-auto text-white bg-red-600 rounded-lg"
                            onClick={() =>
                              handleFriendRequestCancel(friendRequest.key)
                            }
                          >
                            cancel
                          </button>
                        </>
                      ) : (
                        <button
                          // key={friendRequest.key}
                          className="px-8 py-3 ml-auto text-white bg-purple-600 rounded-lg"
                          onClick={() =>
                            handleFriendRequest(
                              user.userId,
                              user.name,
                              user.photoURL
                            )
                          }
                        >
                          join
                        </button>
                      )
                    )
                  ) : (
                    <button
                      // key={friendRequest.key}
                      className="px-8 py-3 ml-auto text-white bg-purple-600 rounded-lg"
                      onClick={() =>
                        handleFriendRequest(
                          user.userId,
                          user.name,
                          user.photoURL
                        )
                      }
                    >
                      join
                    </button>
                  )}
                </People>
              )
          )}
    </Card>
  );
};

export default UserList;
