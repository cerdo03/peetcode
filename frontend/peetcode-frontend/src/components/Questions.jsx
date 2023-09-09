import React, { useEffect, useState } from "react";
import peetcodeLogo from "../assets/peetcodeLogo.png";
import {BACKEND_URL} from "./constants.js"
import axios from "axios";
import Cookies from 'js-cookie';
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

function Questions() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true)
  const token = Cookies.get("authToken");
  useEffect(() => {
    const apiUrl = BACKEND_URL+"/questions/"+id;
    const headers = {
      Authorization: `Bearer ${token}`, 
    };
    axios
      .get(apiUrl,{headers})
      .then((response)=>{
        console.log(response.data,"question response from api");
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      })
      .catch((error)=>{
        console.error("Error fetching questions:", error);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      });
  }, [])
  
  if(isLoading){
    return (
      <>
      <div className="bg-[#1A1A1A] min-h-screen flex flex-col items-center justify-center mb-[100px]">
        <ReactLoading type="balls" color="#FFFFFF"
                height={100} width={100} />
      </div>
      </>
    );
  }
  return (
    <>
      <div className="bg-zinc-200 min-h-screen flex flex-col">

      </div>
    </>
  );
}
export default Questions;
