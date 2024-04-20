import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Flex from "../components/layouts/Flex";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addLoginUserInfo } from "../features/user/userSlice";
import GroupList from "../components/featuresComponent/GroupList";
import UserList from "../components/featuresComponent/UserList";
import FriendList from "../components/featuresComponent/FriendList";
import BlockUsers from "../components/featuresComponent/BlockUsers";

const Home = () => {
  const auth = getAuth();
  const data = useSelector((state) => state.userLoginInfo.userLoginInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verfied, setVerifed] = useState(false);
  onAuthStateChanged(auth, (user) => {
    setVerifed(user.emailVerified);
    dispatch(addLoginUserInfo(user));
    localStorage.setItem("userInfo", JSON.stringify(user));
  });
  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      {verfied ? (

        <>
          <GroupList />
          <UserList />
          <FriendList />
          <BlockUsers />
        </>

      ) : (
        <p>please verfiy your email</p>
      )}
    </>
  );
};

export default Home;
