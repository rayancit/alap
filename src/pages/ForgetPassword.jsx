import React, { useState } from 'react'
import Input from '../components/layouts/Input'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
const ForgetPassword = () => {
    const [email, setEmail] = useState("")
    const auth = getAuth();
    const handleSendPasswordResetEmail = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.success("reset email send", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(error);
            });
    }
    return (
        <>
            <ToastContainer />
            <h2>enter your email</h2>
            <Input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <button className='bg-[#5F35F5] w-full py-3 text-white mt-3 rounded-full' onClick={handleSendPasswordResetEmail}>send reset email</button>
            <button className='bg-[#5F35F5] w-full py-3 text-white mt-3 rounded-full'>login</button>
        </>
    )
}

export default ForgetPassword