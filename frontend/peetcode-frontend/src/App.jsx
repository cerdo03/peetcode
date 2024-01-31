import './App.css'
import Login from "./components/LoginPage"
import Signup from "./components/SignupPage"
import { Routes, Route } from "react-router-dom";
import AllProblems from './components/ProblemsPage'
import Questions from './components/Questions'
import axios from "axios";


function App() {
  axios.interceptors.response.use(function (response) {
    // If the response was successful, just return it
    return response;
  }, function (error) {
    // If the response had a 401 status code, log the user out
    if (error.response && error.response.status === 401) {
      // Call your logout API
      axios.post(BACKEND_URL + "/logout", {}, { withCredentials: true })
      
    }
  
    // If the response had a different status code, just reject the promise
    return Promise.reject(error);
  });
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/questions" element={<AllProblems/>} />
      <Route path="/questions/:id" element={<Questions/>} />
    </Routes>
  )
}

export default App
