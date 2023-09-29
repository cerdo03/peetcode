import React, { useState } from "react";
import peetcodeLogo from "../assets/peetcodeLogo.png";
import {BACKEND_URL} from "./constants.js"
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submissionPending, setSubmissionPending] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false)
  const navigate = useNavigate();
  document.getElementsByTagName("body")[0].classList.add(["overscroll-none"])
  const handleLogin = async (e)=>{
    setIsIncorrect(false);
    e.preventDefault();
    setSubmissionPending(true);
    try{
      const data = {
        "username":username,
        "password":password
      }
      const response = await axios.post(BACKEND_URL+"/login", data)
      console.log(response,"resposme");
      if(response.status==200){
        if(response.data.success===true){
          Cookies.set("authToken",response.data.token,{ expires: 2 });
          setTimeout(() => {
            setSubmissionPending(false);
            navigate('/questions')
          }, 2000);
          
        }
        else{
          console.log("Some error has occured");
          setTimeout(() => {
            setSubmissionPending(false);
          }, 2000);
        }
      }
      
    }
    catch(error){
      console.log(error,"Some error has occured")
      setTimeout(() => {
        setSubmissionPending(false);
        if(error.response.status==401){
          setIsIncorrect(true);
        }
      }, 2000);
    }

  }


  return (
    <>
    {submissionPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 transition-opacity ${submissionPending ? 'opacity-100' : 'opacity-0'}">
          <div className="bg-opacity-60 p-4 rounded-md">
            <ReactLoading type="balls" color="#FFFFFF" height={100} width={100} />
          </div>
        </div>
      )}
      <div className="bg-zinc-200 h-full flex flex-col grow-[1]">
        <div className="w-full grow-[1.5]"/>
        <div className=" w-full justify-center items-start flex grow-[3]">
          <div className=" bg-white w-[400px] min-w-{96} rounded-xl p-6 block">
            <div className="w-full justify-center flex flex-col items-center mt-3">
              <img alt="Logo" className="w-16" src={peetcodeLogo} />
              <span className="text-black font-semibold text-xl mt-2 font-mono">
                Peetcode
              </span>
            </div>
            {/* Username Input */}
            <div className="mb-6 mt-8">
              <input
                type="text"
                id="username"
                className="w-full border border-gray-300 rounded py-2 px-4 bg-white text-black font-light hover:border hover:border-black focus:border focus:border-black"
                placeholder="Username"
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-8">
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded py-2 px-4 bg-white text-black font-light hover:border hover:border-black focus:border focus:border-black"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
              />
              {isIncorrect && <div className="mt-4 text-center text-red-600 text-sm" id="">
                The username and/or password you specified are not correct.
              </div>}
            </div>
            

            {/* SignIn Button */}
            <div className="mb-3">
              <button className="w-full" 
              onClick={handleLogin}
              >Sign In</button>
            </div>

            {/* Forgot password and switch to signup page buttons*/}
            <div className="text-black text-sm flex justify-between mx-1 mb-10">
              <span className="hover:cursor-pointer">Forgot Password?</span>
              <span className="hover:cursor-pointer">Sign Up</span>
            </div>

            {/* Captcha */}
            <div className="mb-10">
              <span className="text-slate-400 text-sm">
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  className="text-slate-400 text-sm underline"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  className="text-slate-400 text-sm underline"
                >
                  Terms of Service
                </a>{" "}
                apply.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
