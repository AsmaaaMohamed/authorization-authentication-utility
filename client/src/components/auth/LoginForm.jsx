import { Lock, Mail } from 'lucide-react'

const LoginForm = () => {
  return (
    <div>
      <img src="{assets.login}" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" alt="" />
      <div className="w-full flex flex-col items-center bg-slate-900 p-10 rounded-lg shadpw-lg sm:w-96 text-indigo-300 text-sm ">
        <h2 className="text-2xl font-semibold mb-4 text-white text-center">
          Login
        </h2>
        <p className="mb-4 text-center text-sm">
          Login to your account
        </p>
        <form>
          <div className="flex items-center gap-2 mb-4 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <Mail width={16} height={16}/>
            <input className="bg-transparent outline-none flex-1" type="email" placeholder="Your Email" required/>
          </div>
          <div className="flex items-center gap-2 mb-4 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <Lock width={16} height={16}/>
            <input className="bg-transparent! outline-none flex-1" type="password" placeholder="Password" required/>
          </div>
          <div className="pt-1">
            <a href="/forgot-password" className="text-xs text-indigo-500">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 mt-4 px-5 py-2 rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 hover:bg-[#5d6ef5] text-white transition-all font-medium">
            Login
          </button>
          <p className="mt-4 text-center text-[11px] text-[#8c97b7]">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-500 underline">
              SignUp here
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginForm