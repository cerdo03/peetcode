import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "./components/LoginPage"
import { Routes, Route } from "react-router-dom";
import AllProblems from './components/ProblemsPage'
import Questions from './components/Questions'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/questions" element={<AllProblems/>} />
        <Route path="/questions/:id" element={<Questions/>} />
      </Routes>
    </>
  )
}

export default App
