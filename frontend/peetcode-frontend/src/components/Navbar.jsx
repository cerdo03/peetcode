import { useState } from 'react'
import peetcodeLogo from "../assets/peetcodeLogo.png";

function Navbar(){
  return (
    <nav className="bg-[#282828] py-2 border-b-2 border-[#464646]">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
      <a href="/questions" className="text-white text-2xl font-bold flex flex-row justify-center items-center hover:text-white">
        <img alt="Logo" className="w-8" src={peetcodeLogo} />
        <div className="ml-4 font-mono">PeetCode</div>
      </a>
      <ul className="flex space-x-4 mt-4 md:mt-0">
        <li><a href="/" className="text-white hover:text-blue-300">Home</a></li>
        <li><a href="/about" className="text-white hover:text-blue-300">About</a></li>
        <li><a href="/services" className="text-white hover:text-blue-300">Services</a></li>
        <li><a href="/contact" className="text-white hover:text-blue-300">Contact</a></li>
      </ul>
    </div>
  </nav>
  )
}

export default Navbar;

