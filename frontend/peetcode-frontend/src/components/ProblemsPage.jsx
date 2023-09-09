import React, { useEffect, useState } from "react";
import peetcodeLogo from "../assets/peetcodeLogo.png";
import {BACKEND_URL} from "./constants.js"
import axios from "axios";
import Cookies from 'js-cookie';


function AllProblems() {
  const token = Cookies.get("authToken");
  const [questions, setQuestions] = useState([])
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
        
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });

  },[]);
  return (
    <>
      <div className="bg-[#1A1A1A] min-h-screen flex flex-col">
      <table className="w-[1500px]">
        <thead>
          <tr>
            <th>Que Id</th>
            <th>Title</th>
            <th>Acceptance Rate</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <RenderProblem
              key={question._id}
              title={question.title}
              acRate={question.acRate}
              difficulty={question.difficulty}
              que_id={question.que_id}
            />
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

function RenderProblem(props){
  const title = props.title;
  const acRate = props.acRate;
  const difficulty = props.difficulty;
  const que_id = props.que_id;
  
  return <tr>
        <td>
            {que_id}
        </td>
        <td>
            {title}
        </td>
        <td>
            {acRate}
        </td>
        <td>
            {difficulty}
        </td>
  </tr>
  
}
export default AllProblems;
