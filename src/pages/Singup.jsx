import React, { useState } from "react";
import Flex from "../components/layouts/Flex";
import singupBg from "../assets/singup.png";
import Input from "../components/layouts/Input";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set, push } from "firebase/database";
const Singup = () => {
  const db = getDatabase();
  const navigate = useNavigate();
  const auth = getAuth();
  const [singupData, setSingupData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [singupDataError, setSingupDataError] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputValues = (e) => {
    const { name, value } = e.target;
    setSingupData((olddata) => ({ ...olddata, [name]: value }));
    setSingupDataError((olddata) => ({ ...olddata, [name]: "" }));
  };

  const handleSubmit = () => {
    if (!singupData.email) {
      setSingupDataError((olddata) => ({ ...olddata, email: "email daw nai" }));
    }
    if (!singupData.name) {
      setSingupDataError((olddata) => ({ ...olddata, name: "name daw nai" }));
    }
    if (!singupData.password) {
      setSingupDataError((olddata) => ({
        ...olddata,
        password: "password daw nai",
      }));
    }
    if (singupData.name && singupData.email && singupData.password) {
      let regEmail =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regEmail.test(singupData.email)) {
        setSingupDataError((olddata) => ({
          ...olddata,
          email: "email thik na",
        }));
      } else {
        setLoading(true);
        createUserWithEmailAndPassword(
          auth,
          singupData.email,
          singupData.password
        )
          .then((userCredential) => {
            sendEmailVerification(auth.currentUser).then(() => {
              updateProfile(auth.currentUser, {
                displayName: singupData.name,
                photoURL: "/src/assets/deafult.png",
              }).then(() => {
                set(push(ref(db, "users/")), {
                  userId: auth.currentUser.uid,
                  name: singupData.name,
                  email: singupData.email,
                  photoURL: auth.currentUser.photoURL,
                }).then(() => {
                  toast.success("account hoise", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  toast.info("verify email tomar mail a chole gese", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  setTimeout(() => {
                    navigate("/login");
                  }, 5000);
                  setLoading(false);
                });
              });
            });
          })
          .catch((error) => {
            console.error(error);
            if (error.code.includes("auth/email-already-in-use")) {
              setSingupDataError((olddata) => ({
                ...olddata,
                email: "email-already-in-use",
              }));
              setLoading(false);
            }
          });
      }
    }
  };
  return (
    <Flex className={"w-screen h-screen"}>
      <ToastContainer />
      <Flex className="w-[60%] flex-col justify-center items-center">
        <div className="w-1/2">
          <h1>Get started with easily register</h1>
          <p>Free register and you can enjoy it</p>
          <Input
            type="email"
            label={"Email Address"}
            value={singupData.email}
            name="email"
            onChange={handleInputValues}
          />
          <p className="text-red-400">{singupDataError.email}</p>
          <Input
            type="text"
            label={"Full name"}
            value={singupData.name}
            name="name"
            onChange={handleInputValues}
          />
          <p className="text-red-400">{singupDataError.name}</p>
          <Input
            type="password"
            label={"Password"}
            value={singupData.password}
            name="password"
            onChange={handleInputValues}
          />
          <p  className="text-red-400 ">{singupDataError.password}  </p>
          {loading ? (
            <Flex className={"justify-center items-center "}>
              {" "}
              <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#5F35F5"
                raaLabel="three-dots-loading"
                wrdius="9"
                ariapperStyle={{}}
                wrapperClass=""
              />
            </Flex>
          ) : (
            <button
              className="bg-[#5F35F5] w-full py-3 text-white mt-3 rounded-full"
              onClick={handleSubmit}
            >
              Sign up
            </button>
          )}

          <Link to="/login" className="mt-2 text-center block">
            Already have an account ?{" "}
            <span className="text-[#EA6C00] cursor-pointer">Sign In</span>
          </Link>
        </div>
      </Flex>
      <div className="w-[40%] h-full  ">
        <img src={singupBg} alt="" className="w-full h-full object-cover" />
      </div>
    </Flex>
  );
};

export default Singup;
