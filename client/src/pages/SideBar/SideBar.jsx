import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from "../../store/useAuthStore";

export default function SideBar() {

    const { isLoggedIn, userData, logout } = useAuthStore();
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <>
            <div className='sidebar w-1/2 md-w-[35%] lg:w-[15%] px-2 flex-col flex  '>


                <div className="headSideBar">
                    <div className='flex '>
                        <div className="w-5.5 h-5.5 rounded-[5px] bg-[#4fe0c4] flex items-center justify-center font-['IBM_Plex_Mono'] text-[11px] font-bold text-[#08130f]">
                            T
                        </div>

                        <h1 className='mb-5 ms-3'>TeamForge</h1>
                    </div>

                    <div className="ProductTeam">
                        <p className='mb-2 text-gray-500'>Product Team</p>

                        <div onClick={() => navigate('/board')} className='cursor-pointer flex gap-3 mb-1 items-center text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid">
                                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                            </svg>
                            <p>Board</p>

                        </div>
                        <div onClick={() => navigate('/members')} className='cursor-pointer flex gap-3 mb-1 items-center text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="lucide lucide-users text-gray-500">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <p>Members</p>

                        </div>
                        <div onClick={() => navigate('/notfications')} className='cursor-pointer flex gap-3 mb-1 items-center text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="lucide lucide-bell">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                            </svg>
                            <p>Notfications</p>

                        </div>
                        <div onClick={() => navigate('/settings')} className='cursor-pointer flex gap-3 mb-1 items-center text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="lucide lucide-settings">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <p >Settings</p>

                        </div>
                    </div>

                    <hr className='text-gray-500 my-2 mx-1' />


                    <div className="Projects mt-5">
                        <p className='mb-2 text-gray-500'>Projects</p>

                        <div className='cursor-pointer flex gap-3 mb-1 items-center text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5C6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hash">
                                <line x1="4" x2="20" y1="9" y2="9"></line>
                                <line x1="4" x2="20" y1="15" y2="15"></line>
                                <line x1="10" x2="8" y1="3" y2="21"></line>
                                <line x1="16" x2="14" y1="3" y2="21"></line>
                            </svg>
                            <p>Sprint 1</p>

                        </div>
                        <div className='cursor-pointer flex gap-3 mb-1 items-center text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5C6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hash">
                                <line x1="4" x2="20" y1="9" y2="9"></line>
                                <line x1="4" x2="20" y1="15" y2="15"></line>
                                <line x1="10" x2="8" y1="3" y2="21"></line>
                                <line x1="16" x2="14" y1="3" y2="21"></line>
                            </svg>
                            <p>Backend Utils</p>

                        </div>
                        <div className='cursor-pointer flex gap-3 mb-1 items-center text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5C6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hash">
                                <line x1="4" x2="20" y1="9" y2="9"></line>
                                <line x1="4" x2="20" y1="15" y2="15"></line>
                                <line x1="10" x2="8" y1="3" y2="21"></line>
                                <line x1="16" x2="14" y1="3" y2="21"></line>
                            </svg>
                            <p>Mobile App</p>

                        </div>

                    </div>

                    <hr className='text-gray-500 my-2 mx-1' />



                </div>






                {/* Without AI */}


                <div onClick={handleLogout} className="cursor-pointer bottomSideBar mt-auto flex items-center justify-between  ">
                    <div className="flex  items-center">

                        <div className="w-6.5 h-6.5 rounded-md bg-[#1b1f26] border border-[#262b33] flex items-center justify-center text-[10.4px] font-['IBM_Plex_Mono'] text-[#8890a0] shrink-0">
                            AF
                        </div>
                        <div className="flex-1 ms-3">
                            <div className="text-[12.5px] text-[#e4e7ec]">
                                Ali Fouda
                            </div>

                            <div className="text-[10.5px] text-[#5c6472]">
                                Owner
                            </div>
                        </div>
                    </div>



                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#5C6472"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3.25 h-3.25"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                    </div>
                </div>



                {/* With AI */}

                {/* <div className="bottomSideBar mt-auto pt-4 flex items-center justify-between border-t border-gray-800">
                    {isLoggedIn ? (
                        <>
                            <div className={`flex items-center transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="w-7 h-7 rounded-md bg-[#1b1f26] border border-[#262b33] flex items-center justify-center text-[11px] font-['IBM_Plex_Mono'] text-[#8890a0] shrink-0 font-bold">
                                    {getInitials(userData?.name)}
                                </div>
                                <div className="flex-1 ms-3">
                                    <div className="text-[12.5px] font-medium text-[#e4e7ec] truncate max-w-25">
                                        {userData?.name || "User"}
                                    </div>
                                    <div className="text-[10.5px] text-[#5c6472]">
                                        Owner
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                disabled={isLoading}
                                title="Logout"
                                className={`p-1.5 rounded transition-colors text-gray-400 
                                ${isLoading
                                        ? 'cursor-not-allowed opacity-50 bg-gray-800'
                                        : 'hover:bg-gray-800 hover:text-white cursor-pointer'}`}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" x2="9" y1="12" y2="12" />
                                    </svg>
                                )}
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm font-medium text-[#4fe0c4] hover:underline w-full text-center py-1"
                        >
                            Login
                        </Link>
                    )}
                </div> */}


            </div>


        </>
    )
}
