import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './editor.css';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import { useParams } from 'react-router-dom';
import { FaRegLightbulb } from "react-icons/fa";

const Layout = styled.div`
    flex-direction: row;
    padding: 5px 1;
    color: #000000;
    font-size: 20px;
    font-family: sans-serif;
    flex: 1;
    background-color: #FFFFFF;
`;

const SourceCodeContainer = styled.div`
    flex: 3;
`;

function ProblemInfoComponent({ problemId }) {
    console.log("Problem Id:", problemId);
    const [problemData, setProblemData] = useState({});
  
    useEffect(() => {
      if (problemId !== undefined) {
        axios
          .get(`http://localhost:8000/api/v2/problems/${problemId}/`)
          .then(response => {
            setProblemData(response.data);
          })
          .catch(error => {
            console. error(error);
          });
      }
    }, [problemId]);

    return (
      <div>
        <div key={problemData.id}>
          <div className='description-container'>
            <p className='description-text'> {problemData.title} </p>
            <p className='description-text'> {problemData.description}</p>
          </div>
          <div className='io-container'>
            <div className='input-container'>
              Input<br /> {problemData.input_format}
            </div>
            <div className='output-container'>
              Output<br /> {problemData.output_format}
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
    handleSourceCodeChange
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
          fontSize={12}
        />
      </div>
    );
}

function ExecutionResultComponent({ executionResult, testCases }) {
    return (
      <div className="execution-result">
        <h4>Execution result</h4>
        <p>{executionResult}</p>
        <h4>Test Cases Result:</h4>
        <ul>
          {testCases.map((testCase, index) => (
            <li key={index}>
              Test case {testCase.test_case}: {testCase.status}
            </li>
          ))}
        </ul>
      </div>
    );
}

function Editor() {
    const { id } = useParams();
    const problemId = id;

    const [executionResult, setExecutionResult] = useState(null);
    const [sourceCode, setSourceCode] = useState('def solution(x):\n\t# Write your code here\n\treturn y');
    const [testCases, setTestCases] = useState([]);

    function handleSourceCodeChange(value) {
      setSourceCode(value);
    }

    function handleSourceCodeSubmit() {
      axios
      .post('http://localhost:8000/api/v2/submissions/', {
          user: 1, // replace with the actual user id
          problem: problemId,
          language: "PY",
          code: sourceCode,
      })
      .then(response => {
          console.log(JSON.stringify(response.data, null, 2));
          if (
            response.data &&
            response.data.grading_results &&
            response.data.grading_results.body &&
            Array.isArray(response.data.grading_results.body.test_cases)
          ) {
            console.log(response.data.grading_results.body.test_cases);
            setTestCases(response.data.grading_results.body.test_cases);
          } else {
            console.warn("Unexpected response structure", response.data);
            setTestCases([]);
          }
          console.log('Response', response);
          console.log('Execution result:', response.data.result);
          alert('Source code submitted successfully!');
          if (response.data.result === "P") {
              setExecutionResult("🎉This is the correct answer🎉");
          } else if (response.data.result === "F") {
              setExecutionResult("😵Wrong😵");
          } else {
              setExecutionResult("Error occurred: " + response.data.result);
          }
      })
      .catch(error => {
          console.error(error.response);
          alert('An error occurred while submitting the source code.');
      });
  }
  
  

    return (
      <div className="online-judge-layout">
        <Layout className="editor_container">
          <div className="problem_info_container">
            <ProblemInfoComponent problemId={problemId} />
          </div>
          <SourceCodeContainer className="source-code-and-execution-result" >
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
              <ExecutionResultComponent problemId={problemId} executionResult={executionResult} testCases={testCases} />
            </div>
          </SourceCodeContainer>
        </Layout>
        <div className="editor-footer">
          <div className="button-container">
            <button onClick={handleSourceCodeSubmit} className="submit-button">Submit</button>
          </div>
        </div>
      </div>
    );
}

export default Editor;