import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./editor.css";
import axios from "axios";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import { useParams } from "react-router-dom";
import { FaRegLightbulb } from "react-icons/fa";
import Modal from "react-modal";

const Layout = styled.div`
  flex-direction: row;
  padding: 5px 1;
  color: #000000;
  font-size: 20px;
  font-family: sans-serif;
  flex: 1;
  background-color: #ffffff;
`;

const SourceCodeContainer = styled.div`
  flex: 3;
`;

function Header({ problemData, showHintModal }) {
  return (
    <div className="editor-header">
      <div className="header-left">
        <span className="problem-level">{problemData.level}</span>
        <span className="problem-title">{problemData.title}</span>
      </div>
      <div className="header-right">
        <button onClick={showHintModal} className="hint-button">
          <FaRegLightbulb /> Hint
        </button>
      </div>
    </div>
  );
}

function ProblemInfoComponent({ problemId }) {
  const [problemData, setProblemData] = useState({});

  useEffect(() => {
    if (problemId !== undefined) {
      axios
        .get(`http://localhost:8000/api/v2/problems/${problemId}/`)
        .then((response) => {
          setProblemData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [problemId]);

  return (
    <div>
      <div key={problemData.id}>
        <div className="description-container">
          {/* <p className="description-text"> {problemData.title} </p> */}
          <p className="description-text"> {problemData.description}</p>
        </div>
        <div className="io-container">
          <div className="input-container">
            Input
            <br /> {problemData.input_format}
          </div>
          <div className="output-container">
            Output
            <br /> {problemData.output_format}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceCodeInputComponent({
  problemId,
  executionResult,
  setExecutionResult,
  sourceCode,
  handleSourceCodeChange,
}) {
  return (
    <div className="source-code-input">
      <AceEditor
        mode="python"
        theme="monokai"
        name="source-code-editor"
        value={sourceCode}
        onChange={handleSourceCodeChange}
        editorProps={{ $blockScrolling: true }}
        height="500px"
        width="100%"
        fontSize={16}
      />
    </div>
  );
}

function ExecutionResultComponent({ executionResult, testCases }) {
  return (
    <div className="scrollable-section">
      <div className="execution-result">
        <h4>- 채점 결과 -</h4>
        <p>{executionResult}</p>
        <h4>- Test Case 채점 기록 -</h4>
        <ul>
          {testCases.map((testCase, index) => (
            <li key={index}>
              Test case {testCase.test_case}: {testCase.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Editor() {
  const { id } = useParams();
  const problemId = id;

  const [problemData, setProblemData] = useState({});
  const [executionResult, setExecutionResult] = useState(null);
  const [sourceCode, setSourceCode] = useState(
    "def solution(x):\n\t# Write your code here\n\treturn y"
  );
  const [testCases, setTestCases] = useState([]);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (problemId !== undefined) {
      axios
        .get(`http://localhost:8000/api/v2/problems/${problemId}/`)
        .then((response) => {
          setProblemData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [problemId]);

  function handleSourceCodeChange(value) {
    setSourceCode(value);
  }

  function handleSourceCodeSubmit() {
    axios
      .post("http://localhost:8000/api/v2/submissions/", {
        user: 1,
        problem: problemId,
        language: "PY",
        code: sourceCode,
      })
      .then((response) => {
        if (
          response.data &&
          response.data.grading_results &&
          response.data.grading_results.body &&
          Array.isArray(response.data.grading_results.body.test_cases)
        ) {
          setTestCases(response.data.grading_results.body.test_cases);
        } else {
          setTestCases([]);
        }
        alert("소스코드가 성공적으로 제출되었습니다!");
        if (response.data.result === "P") {
          setExecutionResult("🎉🎊정답입니다🎊🎉");
        } else if (response.data.result === "F") {
          setExecutionResult("😵😿틀렸습니다😿😵");
        } else {
          setExecutionResult(
            response.data.grading_results.result || "Unknown Error"
          );
        }
      })
      .catch((error) => {
        console.error(error.response);
      });
  }

  function showHintModal() {
    setShowHint(true);
  }

  function closeHintModal() {
    setShowHint(false);
  }

  return (
    <div className="online-judge-layout">
      <div className="editor-header">
        <div className="editor-header-wrapper">
          <div className="editor-header-container1">
            {problemData.level} &nbsp;&nbsp;&gt;&nbsp;&nbsp; &nbsp;{problemData.title}
          </div>
          <button className="hint-button" onClick={showHintModal}>
            힌트
          </button>
        </div>
      </div>
      <Layout className="editor_container">
        <div className="problem_info_container">
          <ProblemInfoComponent problemId={problemId} />
        </div>
        <SourceCodeContainer className="source-code-and-execution-result">
          <div className="source-code-container">
            <SourceCodeInputComponent
              problemId={problemId}
              executionResult={executionResult}
              setExecutionResult={setExecutionResult}
              sourceCode={sourceCode}
              handleSourceCodeChange={handleSourceCodeChange}
            />
          </div>
          <div className="execute-container">
            <ExecutionResultComponent
              problemId={problemId}
              executionResult={executionResult}
              testCases={testCases}
            />
          </div>
        </SourceCodeContainer>
      </Layout>
      <div className="editor-footer">
        <div className="button-container">
          <button onClick={handleSourceCodeSubmit} className="submit-button">
            Submit
          </button>
        </div>
      </div>
      {showHint && (
        <div className="hint-modal">
          <h2>Hint</h2>
          <p>{problemData.hint}</p>
          <button onClick={closeHintModal}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Editor;