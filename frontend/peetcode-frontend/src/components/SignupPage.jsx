import React, { useEffect, useState } from "react";
import peetcodeLogo from "../assets/peetcodeLogo.png";
import { BACKEND_URL } from "./constants.js"
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [submissionPending, setSubmissionPending] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        if (password != confirmPassword) {
            setPasswordsMatch(false);
        }
        else {
            setPasswordsMatch(true);
        }
    }, [confirmPassword, password])
    const navigate = useNavigate();
    document.getElementsByTagName("body")[0].classList.add(["overscroll-none"])

    const handleSignUp = async (e) => {
        const validate = handleValidation();
        if (!validate) {
            return;
        }

        setPasswordsMatch(true);
        e.preventDefault();
        setSubmissionPending(true);
        try {
            const data = {
                "username": username,
                "password": password,
                "name": name,
                "email": email
            }
            const response = await axios.post(BACKEND_URL + "/signup", data, { withCredentials: true })
            console.log(response, "resposme");
            if (response.status == 200) {
                if (response.data.success === true) {
                    Cookies.set("authToken", response.data.token, { expires: 2 });
                    setTimeout(() => {
                        setSubmissionPending(false);
                        navigate('/questions')
                    }, 2000);

                }
                else {
                    console.log("Some error has occured");
                    toast.error(response.data.message)
                    setTimeout(() => {
                        setSubmissionPending(false);
                    }, 2000);
                }
            }

        }
        catch (error) {
            console.log(error, "Some error has occured")
            toast.error(error.response.data.message)
            setTimeout(() => {
                setSubmissionPending(false);
            }, 2000);
        }

    }

    const handleValidation = () => {
        if (password != confirmPassword) {
            setPasswordsMatch(false);
            return false;
        }
        else {
            setPasswordsMatch(true);
        }

        const usernameRegex = /^[a-zA-Z0-9]{5,}$/; // At least 5 characters, alphabets and numbers
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, at least one letter and one number

        if (!usernameRegex.test(username)) {
            toast.error("Username should be at least 5 characters long and contain only alphabets and numbers.");
            return false;
        }

        if (!passwordRegex.test(password)) {
            toast.error("Password should be at least 8 characters long and contain at least one alphabet and one number.");
            return false;
        }
        const nameRegex = /^[a-zA-Z\s]+$/; // Only alphabets and spaces
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email format

        if (!nameRegex.test(name)) {
        toast.error("Name should only contain alphabets and spaces.");
        return false;
        }

        if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return false;
        }

        return true;
    }


    return (
        <>
            <ToastContainer theme='dark' />
            {submissionPending && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 transition-opacity ${submissionPending ? 'opacity-100' : 'opacity-0'}">
                    <div className="bg-opacity-60 p-4 rounded-md">
                        <ReactLoading type="balls" color="#FFFFFF" height={100} width={100} />
                    </div>
                </div>
            )}
            <div className="bg-zinc-200 h-full flex flex-col grow-[1]">
                <div className="w-full grow-[1.5]" />
                <div className=" w-full justify-center items-start flex grow-[3]">
                    <div className=" bg-white w-[400px] min-w-{96} rounded-xl p-6 block">
                        <div className="w-full justify-center flex flex-col items-center mt-3">
                            <img alt="Logo" className="w-16" src={peetcodeLogo} />
                            <span className="text-black font-semibold text-xl mt-2 font-mono">
                                Peetcode
                            </span>
                        </div>
                        {/* Name Input */}
                        <div className="mb-4 mt-8">
                            <input
                                type="text"
                                id="name"
                                className="w-full border border-gray-300 rounded py-2 px-4 bg-white text-black font-light hover:border hover:border-black focus:border focus:border-black"
                                placeholder="Name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="mb-4">
                            <input
                                type="email"
                                id="email"
                                className="w-full border border-gray-300 rounded py-2 px-4 bg-white text-black font-light hover:border hover:border-black focus:border focus:border-black"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Username Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                id="username"
                                className="w-full border border-gray-300 rounded py-2 px-4 bg-white text-black font-light hover:border hover:border-black focus:border focus:border-black"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-4">
                            <input
                                type="password"
                                id="password"
                                className="w-full border border-gray-300 rounded py-2 px-4 bg-white text-black font-light hover:border hover:border-black focus:border focus:border-black"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                        </div>

                        <div className="mb-8">
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full border border-gray-300 rounded py-2 px-4 bg-white text-black font-light hover:border hover:border-black focus:border focus:border-black"
                                placeholder="Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {!passwordsMatch && <div className="mt-2 text-center text-red-600 text-sm" id="">
                                The passwords don't match.
                            </div>}
                        </div>






                        {/* SignIn Button */}
                        <div className="mb-3">
                            <button className="w-full"
                                onClick={handleSignUp}
                            >Sign Up</button>
                        </div>

                        {/* Forgot password and switch to signup page buttons*/}
                        <div className="text-black text-sm flex justify-center mx-1 mb-10">
                            {/* <span className="hover:cursor-pointer">Forgot Password?</span> */}
                            <Link to="/login" className="hover:cursor-pointer text-black hover:text-gray-600">Already have an account?</Link>
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
export default Signup;
