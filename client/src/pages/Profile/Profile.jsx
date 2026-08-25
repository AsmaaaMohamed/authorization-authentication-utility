import React, { useState } from 'react'
import profile from '../../assets/vite.svg'
import { Mail, User, Phone, FilePlusCorner } from 'lucide-react'

export default function Profile() {

    const [img, setImg] = useState(null)


    function handleImgChange(e) {

        const file = e.target.files[0];
        if (file) {
            setImg(URL.createObjectURL(file));
        }


        console.log(img);
    }


    return (
        <>

            <div className="bg-black w-1/2  py-10 rounded-md text-white text-center">
                <p className="text-4xl font-bold my-3">Profile</p>

                <div className="imgProfile mx-2 py-4 flex justify-center">
                    <div className="relative">
                        <img className="w-50 h-50 object-contain rounded-full border-2" src={img ? img : profile} alt="profile img" />

                        <div className="updateImg px-1 absolute bottom-2 right-2 cursor-pointer flex items-center rounded-full bg-[#333A5C]">
                            <FilePlusCorner width={16} height={16} />
                            <label htmlFor="updateImgProfile" className=" rounded-full p-1 cursor-pointer shadow">
                                Edit
                            </label>

                            <input onChange={handleImgChange} type="file" id="updateImgProfile" className="hidden" />
                        </div>
                    </div>
                </div>



                <form >
                    <div className="flex items-center gap-2 mb-4 w-3/4 mx-auto px-5 py-2 rounded-full bg-[#333A5C]">
                        <User width={16} height={16} />
                        <input className="bg-transparent outline-none flex-1" type="text" placeholder="Your Name" required />
                    </div>

                    <div className="flex items-center gap-2 mb-4 w-3/4 mx-auto px-5 py-2 rounded-full bg-[#333A5C]">
                        <Mail width={16} height={16} />
                        <input className="bg-transparent outline-none flex-1" type="email" placeholder="Your Email" required />
                    </div>

                    <div className="flex items-center gap-2 mb-4 w-3/4 mx-auto px-5 py-2 rounded-full bg-[#333A5C]">
                        <Phone width={16} height={16} />
                        <input className="bg-transparent outline-none flex-1" type="tel" placeholder="Your Phone" required />
                    </div>

                    <button type="submit" className="w-3/4 flex mx-auto items-center justify-center gap-2 mt-4 px-5 py-2 rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 hover:bg-[#5d6ef5] text-white transition-all font-medium cursor-pointer disabled:cursor-not-allowed">
                        Save
                    </button>
                </form >
            </div>






        </>
    )
}
