import { useEffect, useState } from "react";
import Flex from "../components/layouts/Flex";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import People from "../components/People";
import Img from "../components/layouts/Img";
import dPic from "../assets/deafult.png";
import ModalImage from "react-modal-image";
import { FaImage } from "react-icons/fa6";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaCamera } from "react-icons/fa6";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Modal from "../modal/Modal";
import { createPortal } from "react-dom";
import EmojiPicker from "emoji-picker-react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { addChatInfo } from "../features/activechat/activeChat";
import moment from "moment";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
const Message = () => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userLoginInfo.userLoginInfo);
  const [groupName, setGroupName] = useState("");
  const [groupTag, setGroupTag] = useState("");
  const [modal, setModal] = useState(false);
  const groupRef = ref(db, "groups/");
  const groupRequestRef = ref(db, "groupRequest/");
  const [groups, setgroups] = useState([]);
  const friendRef = ref(db, "friends/");
  const messageRef = ref(db, "messages/");
  const [friends, setFriends] = useState([]);
  const [groupRequests, setGroupRequests] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const activeChat = useSelector((state) => state.activeChatInfo.active);
  const storage = getStorage();
  const storageRefe = storageRef(storage, `singleChat/${new Date().getTime()}`);
  useEffect(() => {
    onValue(groupRef, (snapshot) => {
      let groups = [];
      snapshot.forEach((group) => {
        if (group.val().adminId == currentUser.uid) {
          groups.push({
            key: group.key,
            value: group.val(),
          });
        }
      });
      setgroups(groups);
    });
    onValue(friendRef, (snapshot) => {
      let friends = [];
      snapshot.forEach((friend) => {
        if (
          friend.val().friendId == currentUser.uid ||
          friend.val().myId === currentUser.uid
        ) {
          friends.push(friend.val());
        }
      });
      setFriends(friends);
    });
  }, []);
  useEffect(() => {
    if (activeChat) {
      onValue(messageRef, (snapshot) => {
        let allMessage = [];
        snapshot.forEach((message) => {
          if (
            (message.val().recId === currentUser.uid &&
              message.val().sendId === activeChat.id) ||
            (message.val().sendId === currentUser.uid &&
              message.val().recId === activeChat.id)
          ) {
            allMessage.push(message.val());
          }
        });
        setAllMessage(allMessage);
      });
    }
  }, [activeChat]);
  const handleCreateGroup = () => {
    set(push(ref(db, "groups/")), {
      adminId: currentUser.uid,
      adminName: currentUser.displayName,
      groupName,
      groupTag,
    });
  };

  const handleShowGroupRequests = (groupKey) => {
    onValue(groupRequestRef, (snapshot) => {
      let groupRequests = [];
      snapshot.forEach((groupRequest) => {
        if (groupRequest.val().gKey == groupKey) {
          groupRequests.push({
            key: groupRequest.key,
            value: groupRequest.val(),
          });
        }
      });
      setGroupRequests(groupRequests);
    });
    setModal(true);
  };
  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log("takePhoto");
    console.log(dataUri);
  }

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
    if (activeChat.chatType === "singleChat") {
      uploadBytes(storageRefe, blob).then((snapshot) => {
        getDownloadURL(storageRefe)
          .then((url) => {
            set(push(ref(db, "messages/")), {
              sendId: currentUser.uid,
              recId: activeChat.id,
              messageAudio: url,
              time: new Date().toLocaleString(),
            });
          })
          .catch((error) => {
            // Handle any errors
          });
      });
    }
  };

  const handleActiveChat = (info, chatType) => {
    dispatch(addChatInfo({ ...info, chatType }));
  };

  const handleTextMessage = (e) => {
    setTextMessage(e.target.value);
  };
  const handleImageSend = (e) => {
    const file = e.target.files[0];
    if (activeChat.chatType === "singleChat") {
      uploadBytes(storageRefe, file).then((snapshot) => {
        getDownloadURL(storageRefe)
          .then((url) => {
            set(push(ref(db, "messages/")), {
              sendId: currentUser.uid,
              recId: activeChat.id,
              messageImg: url,
              time: new Date().toLocaleString(),
            });
          })
          .catch((error) => {
            // Handle any errors
          });
      });
    }
  };
  
  const handleEmoji = (emoji) => {
    setTextMessage((prev) => prev + emoji.emoji)
  }
  const handleSendMessage = () => {
    if (activeChat.chatType === "singleChat") {
      set(push(ref(db, "messages/")), {
        sendId: currentUser.uid,
        recId: activeChat.id,
        message: textMessage,
        time: new Date().toLocaleString(),
      });
    }
  };
  console.log(allMessage);
  return (
    <>
      {showCamera &&
        createPortal(
          <Modal onclose={() => setShowCamera(false)}>
            <Camera
              onTakePhoto={(dataUri) => {
                handleTakePhoto(dataUri);
              }}
              imageCompression={0.97}
              isMaxResolution={true}
              isImageMirror={true}
              isSilentMode={false}
              isDisplayStartCameraError={true}
              isFullscreen={true}
              sizeFactor={1}
            />
          </Modal>,
          document.querySelector("#modal")
        )}

      <div className="w-[40%]">
        <div>
          <button className="inline-block px-10 py-5 mb-4 text-white bg-black rounded-lg">
            {" "}
            show
          </button>
          <Flex className={"flex-col gap-y-4"}>
            <input
              type="text"
              className="border border-purple-400 "
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              type="text"
              className="border border-purple-400 "
              value={groupTag}
              onChange={(e) => setGroupTag(e.target.value)}
            />
            <button
              className="inline-block px-10 py-5 mb-4 text-white bg-black rounded-lg"
              onClick={handleCreateGroup}
            >
              {" "}
              create a group
            </button>
          </Flex>
        </div>
        <div>
          <h2 className="text-3xl">my groups</h2>
          <div
            className={`  shadow-xl relative ${modal ? "" : "overflow-y-auto h-[30vh]"
              }`}
          >
            {groups?.map((group) => (
              <People
                key={group.value.groupName}
                name={group.value.groupName}
                messageShow={true}
                message={`admin name: ${group.value.adminName}`}
              >
                <button
                  className="px-8 py-3 ml-auto overflow-y-auto text-white bg-yellow-600 rounded-lg"
                  onClick={() => handleShowGroupRequests(group.key)}
                >
                  requests
                </button>
              </People>
            ))}
            {modal && (
              <div className="absolute top-0 left-0 w-full h-full bg-white ">
                <ImCross
                  className="absolute inline-block cursor-pointer right-4 top-4"
                  onClick={() => setModal(false)}
                />
                <div className="mt-6">
                  {groupRequests.length > 0
                    ? groupRequests?.map((group) => (
                      <People
                        key={group.value.groupName}
                        name={group.value.groupReqName}
                        messageShow={true}
                        photoURL={group.value.groupReqPic}
                      >
                        <button
                          className="px-8 py-3 ml-auto text-white bg-green-600 rounded-lg"
                          onClick={() => setModal(true)}
                        >
                          accept
                        </button>
                        <button
                          className="px-8 py-3 ml-auto text-white bg-red-600 rounded-lg"
                          onClick={() => setModal(true)}
                        >
                          cancel
                        </button>
                      </People>
                    ))
                    : "no group"}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-3xl">my friends</h2>
          <div>
            {friends?.map((friend) =>
              friend.friendId === currentUser.uid ? (
                <People
                  onActiveChat={() =>
                    handleActiveChat(
                      {
                        id: friend.myId,
                        name: friend.myName,
                        photoURL: friend.myPhotoURL,
                      },
                      "singleChat"
                    )
                  }
                  key={friend.myName}
                  name={friend.myName}
                  messageShow={false}
                  photoURL={friend.myPhotoURL}
                ></People>
              ) : (
                <People
                  onActiveChat={() =>
                    handleActiveChat(
                      {
                        id: friend.friendId,
                        name: friend.name,
                        photoURL: friend.photoURL,
                      },
                      "singleChat"
                    )
                  }
                  key={friend.name}
                  name={friend.name}
                  messageShow={false}
                  photoURL={friend.photoURL}
                ></People>
              )
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow px-5 w-[50%] h-screen  overflow-y-auto  ">
        {activeChat ? (
          <div>
            <Flex
              className={
                "items-center gap-x-8 border-b border-[rgb(0,0,0,0.25)] pb-4"
              }
            >
              <div className="after:content-[''] after:bg-green-400 after:w-5 after:h-5 after:absolute relative after:bottom-1 after:right-0 after:rounded-full after:border-2 after:border-white after:shadow-onlineShadow">
                <Img src={dPic} className={"w-20 h-20"} />
              </div>
              <div>
                <h2>{activeChat.name} </h2>
                <p>Online</p>
              </div>
              <div></div>
            </Flex>
            <Flex className="flex-col h-[80vh] py-4 pb-20 overflow-y-auto gap-y-5 border-b border-black">
              {allMessage.map((message, index) =>
                message.sendId === currentUser.uid ? (
                  message.message ? (
                    <div className="text-right w-[80%] ml-auto" key={index}>
                      <p className="inline-block text-white bg-[#5F35F5] px-10 py-5 rounded-xl">
                        {message.message}
                      </p>
                      <p>{moment(message.time).fromNow()}</p>
                    </div>
                  ) : (
                    message.messageImg ? (
                      <div
                        className="w-1/2 ml-auto bg-[rgb(0,0,0,0.25)] p-3 rounded-xl"
                        key={index}
                      >
                        <ModalImage
                          small={message.messageImg}
                          large={message.messageImg}
                          alt="Hello World! "
                          showRotate={true}
                        />
                      </div>
                    )
                      : (
                        message.messageAudio &&
                        <div
                          className="w-1/2 ml-auto bg-[rgb(0,0,0,0.25)] p-3 rounded-xl"
                          key={index}
                        >
                          <audio src={message.messageAudio} controls></audio>
                        </div>
                      )
                  )
                ) : message.recId === currentUser.uid && message.message ? (
                  <div className="w-[80%] ml-4">
                    <p
                      className="inline-block bg-[#F1F1F1] px-10 py-5 rounded-xl after:content-[''] after:w-0 after:h-0   after:border-l-[15px] after:border-l-transparent
  after:border-b-[15px] after:border-b-[#F1F1F1]
  after:border-r-[15px] after:border-r-transparent after:absolute relative after:bottom-0 after:left-[-7px]"
                    >
                      {message.message}
                    </p>
                    <p>{moment(message.time).fromNow()}</p>
                  </div>
                ) : (
                  message.messageImg ? (
                    <div className="w-1/2 bg-[rgb(0,0,0,0.25)] p-3 rounded-xl ">
                      <ModalImage
                        small={message.messageImg}
                        large={message.messageImg}
                        alt="Hello World!"
                        showRotate={true}
                      />
                    </div>
                  )
                    : (
                      message.messageAudio &&
                      <div
                        className="w-1/2  bg-[rgb(0,0,0,0.25)] p-3 rounded-xl"
                        key={index}
                      >
                        <audio src={message.messageAudio} controls></audio>
                      </div>
                    )
                )
              )}
            </Flex>
            {showEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}

            <Flex className={"mt-3 gap-4 items-center"}>
              <input
                type="text"
                className="w-full bg-[#F1F1F1] py-3 border px-2 border-black outline-none rounded-xl"
                value={textMessage}
                onChange={(e) => handleTextMessage(e)}
              />
              <Flex className="items-center gap-2 text-3xl">
                <MdOutlineEmojiEmotions
                  onClick={() => setShowEmoji(!showEmoji)}
                />
                <AudioRecorder
                  showVisualizer={false}
                  onRecordingComplete={addAudioElement}
                  audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                  }}
                  downloadOnSavePress={false}
                  downloadFileExtension="webm"
                />
                <FaCamera onClick={() => setShowCamera(true)} />
                <label htmlFor="image">
                  <FaImage />
                  <input
                    type="file"
                    name=""
                    id="image"
                    hidden
                    onChange={(e) => handleImageSend(e)}
                  />
                </label>
              </Flex>
              <button
                className="p-4 text-white bg-blue-500 rounded-xl"
                onClick={handleSendMessage}
              >
                send
              </button>
            </Flex>
          </div>
        ) : (
          <p>no active chat</p>
        )}
      </div>
    </>
  );
};

export default Message;
