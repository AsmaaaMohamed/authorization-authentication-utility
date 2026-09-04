import React, { useEffect } from 'react'
import SideBar from '../SideBar/SideBar'
import { useAuthStore } from '../../store/useAuthStore'
import axios from 'axios'



export default function SettingsPage() {

    const { userData, getUserData, isLoading } = useAuthStore();





    useEffect(() => {
        getUserData()
    }, [])

    console.log(userData);


    return (
        <>
            <div className='text-white gap-2 px-5 md:pt-15 pt-20 pb-10 flex min-h-screen box-border'>
                <SideBar />



                <div className='w-1/2 md:w-[65%] lg:w-[70%] '>
                    <div className='mb-5'>
                        <h2 className='text-2xl'>Settings</h2>
                        <p className='text-gray-500'>Product Team workspace & your profile</p>
                    </div>
                    <hr className='text-gray-500' />

                    <div className="profile">
                        <p className='text-gray-500 my-5'>Profile</p>
                        <div className="my-4">
                            <label className="mb-1.75 block text-xs text-[#8890A0]">
                                Full name
                                <span className="text-[#E8697A]"> *</span>
                            </label>

                            <div className="flex items-center gap-2.25 rounded-lg border w-1/2 border-[#262B33] bg-[#1B1F26] px-3 py-2.5">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="shrink-0 text-[#5C6472]"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>

                                <input
                                    type="text"
                                    value={userData?.name}
                                    className="flex-1 border-none  bg-transparent text-[13.5px] text-[#E4E7EC] outline-none"
                                />
                            </div>
                        </div>



                        <div className="mb-4">
                            <label className="mb-1.75 block text-xs text-[#8890A0]">
                                Email
                                <span className="text-[#E8697A]"> *</span>
                            </label>

                            <div className="flex items-center w-1/2 gap-2.25 rounded-lg border border-[#262B33] bg-[#1B1F26] px-3 py-2.5">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#5C6472"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>

                                <input
                                    type="email"
                                    value={userData?.email}
                                    className="flex-1 border-none bg-transparent text-[13.5px] text-[#E4E7EC] outline-none"
                                />

                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </>
    )
}
