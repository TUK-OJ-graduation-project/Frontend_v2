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
  const [problemData, setProblemData] = useState({});
  
  useEffect(() => {
    if (problemId !== undefined) {
      axios
        .get(`http://127.0.0.1:8000/api/v2/problems/${problemId}/`)
        .then(response => {
          setProblemData(response.data);
        })
        .catch(error => {
          console.error(error);
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
            Output<br />  {problemData.output_format}
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

function ExecutionResultComponent({ problemId, executionResult }) {
  return (
    <div className="execution-result">
      <h4>Execution result</h4>
      <p>{executionResult}</p>
    </div>
  );
}

function Editor() {
  const { id } = useParams();
  const problemId = id;

  const [executionResult, setExecutionResult] = useState(null);
  const [sourceCode, setSourceCode] = useState('');

  function handleSourceCodeChange(value) {
    setSourceCode(value);
  }

  function handleSourceCodeSubmit() {
    axios
    .post('http://127.0.0.1:8000/api/v2/submissions/', {
      user: 1, // replace with the actual user id
      problem: problemId,
      language: "PY",
      code: sourceCode,
    })
    .then(response => {
      console.log('Response', response);
      console.log('Execution result:', response.data.result);
      alert('Source code submitted successfully!');
      if (response.data.result === "P") {
        setExecutionResult("Correct");
      } else if (response.data.result === "F") {
        setExecutionResult("Incorrect");
      } else {
        setExecutionResult("Error: " + response.data.result);
      }
    })
    .catch(error => {
      console.error(error.response.data);
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
              handleSourceCodeChange={handleSourceCodeChange}
            />
          </div>
          <div className="execute-container">
            <ExecutionResultComponent problemId={problemId} executionResult={executionResult} />
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