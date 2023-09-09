import React, { useEffect, useState } from "react";
import peetcodeLogo from "../assets/peetcodeLogo.png";
import {BACKEND_URL} from "./constants.js"
import axios from "axios";
import Cookies from 'js-cookie';
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";

function TextColor(difficulty){
  if(difficulty=="Easy") return "text-green-500";
  else if(difficulty=="Medium") return "text-yellow-500";
  else return "text-red-600";
}

function AllProblems() {
  const token = Cookies.get("authToken");
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  useEffect(()=>{
    const apiUrl = BACKEND_URL+"/questions"
    const headers = {
      Authorization: `Bearer ${token}`, 
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        // Handle the API response and update the state
        if(response.status==200){
          setQuestions(response.data.questions);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      });

  },[]);

  const handleRowClick = (_id) => {
    // Implement your click handler here, `_id` is the input
    const questionUrl = "/questions/"+_id
    console.log(`Row clicked with _id: ${_id}`);
    navigate(questionUrl)
  };
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
      <div className="bg-[#1A1A1A] min-h-screen flex flex-row items-start">
      <div className="h-full grow-[1]"/>
      <div className="overflow-x-auto grow-[3]">
      <table className="w-[1000px]">
        <thead>
          <tr className="text-left border-b border-slate-300">
            <th className="px-4 py-3">Que Id</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Acceptance Rate</th>
            <th className="px-4 py-3">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <RenderProblem
              _id={question._id}
              title={question.title}
              acRate={question.acRate}
              difficulty={question.difficulty}
              que_id={question.que_id}
              onRowClick={handleRowClick}
            />
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </>
  );
}

function RenderProblem(props){
  const title = props.title;
  const acRate = props.acRate;
  const difficulty = props.difficulty;
  const que_id = props.que_id;
  const _id = props._id
  const onRowClick = props.onRowClick
  const handleClick = () => {
    // Call the provided `onRowClick` function with the `_id` when the row is clicked
    onRowClick(_id);
  };
  return <tr className="text-left odd:bg-[#1A1A1A] even:bg-[#2A2A2A]">
        <td className="px-4 py-3">
            {que_id}
        </td>
        <td className="hover:cursor-pointer transition duration-300 ease-out hover:text-blue-700 px-4 py-3" onClick={handleClick}>
            {title}
        </td>
        <td className="px-4 py-3">
            {acRate}
        </td>
        <td className={TextColor(difficulty)+" px-4 py-3"}>
            {difficulty}
        </td>
  </tr>
  
}
export default AllProblems;
