import React, { useState } from 'react'
import Img from './layouts/Img'
import { IoHomeSharp, IoChatbubbleEllipsesOutline, IoNotificationsSharp, IoSettingsSharp, IoLogOutSharp } from "react-icons/io5";
import { getAuth, signOut } from "firebase/auth";
import Flex from './layouts/Flex';
import { Link, useNavigate } from 'react-router-dom';
import Input from './layouts/Input';
import Cropper from "react-cropper";
import { useSelector } from 'react-redux';
const Sidebar = () => {
    const loginUser = useSelector((state) => state.userLoginInfo.userLoginInfo)
    const auth = getAuth();
    const navigate = useNavigate("/login")
    const [modal, setModal] = useState(false)

    const [image, setImage] = useState("");
    const [cropData, setCropData] = useState("#");

    const logout = () => {
        signOut(auth).then(() => {
            localStorage.removeItem("userInfo")
            navigate("/login")
        }).catch((error) => {
            // An error happened.
            console.log(error);
        });
    }
    const handleModal = () => {
        setModal(true)
    }



    const handleImage = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
            console.log(files);
        } else if (e.target) {
            files = e.target.files;
            console.log(files);
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    }

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
    };
    return (
        <>
            <Flex className='bg-[#5F35F5] h-full p-4 w-[15%]  items-center flex-col gap-y-6'>
                <div onClick={handleModal}>
                    <Img src={loginUser.photoURL} className={"w-40 h-40 rounded-full"} />
                </div>
                <p className='text-white'>{loginUser.displayName}</p>
                <Link to={"/"}> <IoHomeSharp className='text-white text-4xl cursor-pointer' /></Link>
                <Link to={"/message"}><IoChatbubbleEllipsesOutline className='text-white text-4xl cursor-pointer' /></Link>
                <IoNotificationsSharp className='text-white text-4xl cursor-pointer' />
                <IoSettingsSharp className='text-white text-4xl cursor-pointer' />
                <IoLogOutSharp className='text-white text-4xl cursor-pointer' onClick={logout} />
            </Flex>
            {
                modal &&
                <Flex className='bg-[#0000004b] w-screen h-screen fixed justify-center items-center'>
                    <div className='w-[60vw]  bg-white rounded-lg p-4  '>

                        {/* <div
                            className="img-preview"
                            style={{ width: "100%", float: "left", height: "300px" }}
                        /> */}
                        {
                            image && <div>
                                <Cropper
                                    style={{ height: "200", width: "200" }}
                                    zoomTo={0.5}
                                    initialAspectRatio={1}
                                    preview=".img-preview"
                                    src={image}
                                    viewMode={1}
                                    minCropBoxHeight={10}
                                    minCropBoxWidth={10}
                                    background={false}
                                    responsive={true}
                                    autoCropArea={1}
                                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                    guides={true}
                                />
                            </div>
                        }
                        <Input type="file" onChange={handleImage} />
                        <Flex className='gap-x-4 mt-4'>
                            <button className='py-4 px-9 bg-blue-600 text-white'>upload</button>
                            <button className='py-4 px-9 bg-red-600 text-white' onClick={() => setModal(false)}>cancel</button>
                        </Flex>
                    </div>
                </Flex>
            }
        </>
    )
}

export default Sidebar