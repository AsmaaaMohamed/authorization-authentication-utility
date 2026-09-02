import React from 'react'
import SideBar from '../SideBar/SideBar'

export default function SettingsPage() {
    return (
        <>
            <div className='text-white gap-2 px-5 md:pt-15 pt-20 pb-10 flex min-h-screen box-border'>
                <SideBar />



                <div className='w-1/2 md:w-[65%] lg:w-[70%]'>Settings</div>

            </div>


        </>
    )
}
