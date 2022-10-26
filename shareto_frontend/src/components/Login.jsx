import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { client } from '../client'

function Login() {
    const navigate = useNavigate();
    const login = useGoogleLogin({
        onSuccess: (tokenRes) => {
            fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenRes?.access_token}`)
                .then((res) => res.json())
                .then((res) => {
                    localStorage.setItem('user', JSON.stringify(res))
                    const { sub: googleID, name, picture: imageUrl } = res;
                    const doc = {
                        _id: googleID,
                        _type: 'user',
                        userName: name,
                        image: imageUrl
                    }
                    client.createIfNotExists(doc)
                        .then(() => {
                            navigate('/', { replace: true })
                        })
                })
        }
    })
    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>
                <video
                    src={shareVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />
                <div className='absolute flex flex-col justify-center items-center inset-0 bg-blackOverlay'>
                    <div className='p-5'>
                        <img src={logo} width="130px" alt='logo' />
                    </div>
                    <div className='shadow-2xl'>
                        <button
                            type="button"
                            className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                            onClick={() => login()}
                        >
                            <FcGoogle className="mr-4" /> Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
