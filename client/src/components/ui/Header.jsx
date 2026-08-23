import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
  return (
    <div className="text-center flex items-center flex-col px-4 text-gray-800">
        <img src={assets.hero_img} alt="header" className="w-36 h-36 rounden-full mb-6"/>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl">Hey Developer 
            <img src={assets.hand_wave} alt="wave" className="w-8 aspect-square" />
        </h1>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Welcome to our app</h2>
        <p className="mb-8">Let's get started with our app and make your life easier and more efficient!</p>
        <button className='border border-gray-500 rounded-full px-8 py-2 cursor-pointer hover:bg-[#cec0db] transition-all' onClick={() => navigate("/signup")}>Get Started</button>
    </div>
  )
}

export default Header