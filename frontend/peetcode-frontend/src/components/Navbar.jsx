import peetcodeLogo from "../assets/peetcodeLogo.png";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_URL } from "./constants.js"
import 'react-toastify/dist/ReactToastify.css';


function Navbar(){
  const navigate = useNavigate();
  const handleLogout = async() => {
    // Implement your click handler here
    const response = await axios.get(BACKEND_URL+"/logout", { withCredentials: true })
    if(response.status === 200){
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    }
    else{
      toast.error("Some error has occured!");
    }
  }
  return (
    <nav className="bg-[#282828] py-2 border-b-2 border-[#464646]">
      <ToastContainer theme="dark"/>
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
      <a href="/questions" className="text-white text-2xl font-bold flex flex-row justify-center items-center hover:text-white">
        <img alt="Logo" className="w-8" src={peetcodeLogo} />
        <div className="ml-4 font-mono">PeetCode</div>
      </a>
      <ul className="flex space-x-4 mt-4 md:mt-0">
        <li><a href="/add_question" className="text-white hover:text-gray-300">Add Question</a></li>
        <li><span onClick={handleLogout} className="text-white hover:text-gray-600 hover:cursor-pointer">Logout</span></li>
      </ul>
    </div>
  </nav>
  )
}

export default Navbar;

