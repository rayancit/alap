import React, { useState } from 'react'
import Flex from '../components/layouts/Flex'
import singupBg from "../assets/singup.png"
import Input from '../components/layouts/Input'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addLoginUserInfo } from '../features/user/userSlice';

const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = getAuth();
  const [singupData, setSingupData] = useState({
    email: "",
    password: ""
  })

  const [singupDataError, setSingupDataError] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);

  const handleInputValues = (e) => {
    const { name, value } = e.target
    setSingupData((olddata) => ({ ...olddata, [name]: value }))
    setSingupDataError((olddata) => ({ ...olddata, [name]: "" }))
  }

  const handleSubmit = () => {
    if (!singupData.email) {
      setSingupDataError((olddata) => ({ ...olddata, email: "email daw nai" }))
    }
    if (!singupData.password) {
      setSingupDataError((olddata) => ({ ...olddata, password: "password daw nai" }))
    }
    if (singupData.email && singupData.password) {
      setLoading(true)
      signInWithEmailAndPassword(auth, singupData.email, singupData.password).then((userCredential) => {
        toast.success("logged in done", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        dispatch(addLoginUserInfo(userCredential.user))
        localStorage.setItem("userInfo", JSON.stringify(userCredential.user))
        setTimeout(() => {
          navigate("/")
        }, 5000);
        setLoading(false)
      }).catch((error) => {
        const errorCode = error.code;
        if (errorCode.includes("auth/invalid-credential")) {
          setSingupDataError((olddata) => ({ ...olddata, email: "invalid email and password" }))
          setLoading(false)
        }
      })
    }



  }
  return (
    <Flex className={"w-screen h-screen"}>
      <ToastContainer />
      <Flex className='w-[60%] flex-col justify-center items-center'>
        <div className='w-1/2'>
          <Input type="email" label={"Email Address"} value={singupData.email} name="email" onChange={handleInputValues} />
          <p className='text-red-400'>{singupDataError.email}</p>
          <Input type="password" label={"Password"} value={singupData.password} name="password" onChange={handleInputValues} />
          <p className='text-red-400'>{singupDataError.password}</p>
          {
            loading ?
              <Flex className={"justify-center items-center "}> <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#5F35F5"
                raaLabel="three-dots-loading"
                wrdius="9"
                ariapperStyle={{}}
                wrapperClass=""
              /></Flex>
              :
              <button className='bg-[#5F35F5] w-full py-3 text-white mt-3 rounded-full' onClick={handleSubmit}>Sign In</button>
          }

          <Link to='/singup' className='mt-2 text-center block'>Already  have an account ? <span className='text-[#EA6C00] cursor-pointer'>Sign up</span> </Link>
          <Link to='/forgetpassword' className='mt-2 text-center block text-[#ea1000] '>forget password </Link>
        </div>
      </Flex>
      <div className='w-[40%] h-full  '>
        <img src={singupBg} alt="" className='w-full h-full object-cover' />
      </div>
    </Flex>
  )
}

export default Signin