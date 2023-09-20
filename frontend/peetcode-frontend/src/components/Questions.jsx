import React, { useEffect, useState } from "react";
import peetcodeLogo from "../assets/peetcodeLogo.png";
import { BACKEND_URL } from "./constants.js";
import axios from "axios";
import Cookies from "js-cookie";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

function CodeEditor(props) {
  return (
    <AceEditor
      mode={props.language}
      theme="monokai"
      name="code-editor"
      fontSize={16}
      width="100%"
      height="100%"
      value={props.defaultCode}
      onChange={(newValue) => {
        console.log("Code:", newValue);
      }}
      className="rounded-b-[8px]"
    />
  );
}

function Dropdown({ lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Javascript");
  const options = ["Javascript", "Python", "Java"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setLang(option.toLowerCase());
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          type="button"
          className="rounded-md shadow-sm px-4 py-2 inline-flex w-35 text-sm font-medium text-[#BFC1C4] hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen ? "true" : "false"}
        >
          {selectedOption}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-0 w-40 shadow-lg z-50 rounded-none overflow-visible">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="block w-full px-2 py-2 text-sm text-white hover:bg-gray-600 rounded-none"
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function TextColor(difficulty) {
  if (difficulty == "Easy") return "text-green-500";
  else if (difficulty == "Medium") return "text-yellow-500";
  else return "text-red-600";
}

function Questions() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("authToken");
  const [question, setQuestion] = useState(null);
  const [lang, setLang] = useState("javascript");
  const [defaultCode, setDefaultCode] = useState("");

  document.getElementsByTagName("body")[0].classList.add(["overscroll-none"])
  
  useEffect(() => {
    if (lang == "python") {
      setDefaultCode("def python():");
    } else if (lang == "javascript") {
      setDefaultCode("function js(){}");
    } else if (lang == "java") {
      setDefaultCode("public private void:");
    }
  }, [lang]);

  useEffect(() => {
    const apiUrl = BACKEND_URL + "/questions/" + id;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        console.log(response.data, "question response from api");
        setQuestion(response.data.question);
        setTimeout(() => {
          setIsLoading(false);
        }, 1);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setTimeout(() => {
          setIsLoading(false);
        }, 1);
      });
  }, []);

  const [sizes, setSizes] = useState(["50%", "50%"]);
  const [horSizes, setHorSizes] = useState(["90%", "10%"]);

  const layoutCSS = {
    height: "100%",
    display: "flex",
  };
  const layoutCSSHor = {
    width: "100%",
    height:"100%",
    display: "flex",
  };
  
  useEffect(() => {
    if(document.getElementById("horizontal_splitter"))
    {
      document.getElementById("horizontal_splitter").parentNode.style.display="inline"
    }
  })
  
  
 
  if (isLoading) {
    return (
      <>
        <div className="bg-[#1A1A1A] min-h-screen flex flex-col items-center justify-center mb-[100px]">
          <ReactLoading type="balls" color="#FFFFFF" height={100} width={100} />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="bg-[#1A1A1A] grow-[1] flex flex-col">
        <SplitPane
          split="vertical"
          sizes={sizes}
          onChange={setSizes}
          sashRender={(index, active) => (
            <SashContent className="action-sash-wrap flex items-center justify-center bg-[#1A1A1A]">
              <span className="action">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2 14"
                  width="2"
                  height="14"
                  fill="currentColor"
                  className="text-gray-5 dark:text-dark-gray-5 transition -translate-y-6 group-hover:text-white dark:group-hover:text-white"
                >
                  <circle
                    r="1"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 1)"
                  ></circle>
                  <circle
                    r="1"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 7)"
                  ></circle>
                  <circle
                    r="1"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 13)"
                  ></circle>
                </svg>
              </span>
            </SashContent>
          )}
        >
          <Pane minSize={50} maxSize="70%" className="py-2 pl-2">
            <div
              style={{ ...layoutCSS, background: "#282828" }}
              className="flex-col rounded-[8px] px-9 py-7"
            >
              <div className="text-white text-lg font-semibold text-left mt-11">
                {question ? question.que_id + ". " + question.title : ""}
              </div>
              <div
                className={
                  TextColor(question.difficulty) +
                  " text-base font-semibold text-left mt-4 mx-1"
                }
              >
                {question ? question.difficulty : ""}
              </div>
              <div className="text-white text-base font-medium text-left mt-7 mx-1">
                {question ? question.description : ""}
              </div>
              <div
                id="testcases"
                className="text-white text-base font-semibold text-left mt-14 mx-1"
              >
                {question.testCases.map((testcase, index) => (
                  <div className="flex flex-col justify-start">
                    <strong>Example {index + 1}:</strong>
                    <pre className="text-white text-left mt-4 mx-4 whitespace-pre-wrap">
                      <div>
                        <strong>Input:</strong>
                        {testcase.input}
                      </div>
                      <div>
                        <strong>Output:</strong>
                        {testcase.output}
                      </div>
                      <div>
                        <strong>Explaination:</strong>
                        {testcase.explaination}
                      </div>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </Pane>
          <Pane minSize={50} maxSize="70%" className="flex justify-center items-center p-2">
            <SplitPane
              split="horizontal"
              sizes={horSizes}
              onChange={setHorSizes}
              sashRender={(index, active) => (
                <SashContent className="action-sash-wrap  items-center  bg-[#1A1A1A]" id="horizontal_splitter">
                  <span className="action">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 2" width="14" height="2" fill="currentColor" class="transition text-gray-5 dark:text-dark-gray-5 group-hover:text-white dark:group-hover:text-white"><circle r="1" transform="matrix(-1 0 0 1 1 1)"></circle><circle r="1" transform="matrix(-1 0 0 1 7 1)"></circle><circle r="1" transform="matrix(-1 0 0 1 13 1)"></circle></svg>
                  </span>
                </SashContent>
              )}
            >
              <Pane minSize={50} maxSize="90%" className="pb-2 bg-[#1A1A1A]">
                <div
                  style={{ ...layoutCSSHor, background: "#282828" }}
                  className="flex-col rounded-[8px]"
                >
                  <div className="bg-[#303030] border-b-2 border-[#454545] flex rounded-t-[8px]">
                    <Dropdown setLang={setLang} lang={lang} />
                  </div>
                  <CodeEditor language={lang} defaultCode={defaultCode} />
                </div>
              </Pane>
              <Pane minSize={50} maxSize="50%" className="pt-2 bg-[#1A1A1A]">
                <div
                  style={{ ...layoutCSSHor, background: "#282828" }}
                  className="flex-col rounded-[8px]"
                >
                  <div className="bg-[#303030] border-b-2 rounded-t-[8px] border-[#454545] py-2 px-3 flex">
                    <div className="text-white text-sm font-medium">
                      Result
                      </div>
                  </div>
                  
                  <div className="bg-[#303030] border-t-2 border-[#454545] mt-auto flex flex-col items-end p-2 rounded-b-[8px]">
                    <button className="bg-green-500 py-1.5 font-medium text-[13px] rounded-md leading-4 mr-8 w-28">
                      Submit
                    </button>
                  </div>
                  
                </div>
              </Pane>
            </SplitPane>
          </Pane>
        </SplitPane>
      </div>
    </>
  );
}
export default Questions;
