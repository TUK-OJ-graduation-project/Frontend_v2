import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../OX_quiz/quiz.css";
import tino from "../OX_quiz/tino2.png";

function ShortQuizPage() {
  const [problemData, setProblemData] = useState({});
  const id = useParams().id;
  useEffect(() => {
    // GET request
    axios
      .get(`http://127.0.0.1:8000/api/v1/problems/blank/${id}/`)
      .then(function (response) {
        console.log(response);
        setProblemData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const [userAnswer, setUserAnswer] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  //다음문제
  const [nextProblem, setNextProblem] = useState("");

  const loadNextProblem = () => {
    const nextProblemId = parseInt(problemData.id) + 1;
    axios
      .get(`http://127.0.0.1:8000/api/v1/problems/blank/${nextProblemId}/`)
      .then(function (response) {
        console.log(response);
        setNextProblem(response.data);
        setProblemData(response.data); // 문제 데이터 업데이트
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAnswerSubmit = () => {
    const isCorrect =
      inputValue.trim().toLowerCase() ===
      problemData.blank_answer.trim().toLowerCase();
    setUserAnswer(inputValue);
    setFeedback(isCorrect ? "정답입니다" : "틀렸습니다");
    setInputValue("");
    //여기서부터 추가해봄
    setIsCorrect(isCorrect);

    // Check if there is a next problem
    if (problemData.next_problem_id) {
      // GET request to fetch the next problem
      axios
        .get(
          `http://127.0.0.1:8000/api/v1/problems/blank/${problemData.next_problem_id}/`
        )
        .then(function (response) {
          console.log(response);
          setProblemData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const renderNextButton = () => {
    if (isCorrect) {
      return (
        <button className="next-btn" onClick={loadNextProblem}>
          다음
        </button>
      );
    }
  };

  return (
    <div>
      <div className="tino-image">
        <img src={tino} className="quiz-tino" />
      </div>
      <div className="quiz-container">
        <div className="qzproblem-container">
          {problemData && Object.keys(problemData).length > 0 && (
            <div key={problemData.id}>
              <p className="qzproblem-container2">{problemData.title}</p>
              <p className="qzproblem-container2">{problemData.description}</p>
            </div>
          )}
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="answer-container">
          <button className="answer-btn" onClick={handleAnswerSubmit}>
            Submit
          </button>
        </div>
        <p className="feedback">{feedback}</p>
        {renderNextButton()}
      </div>
      <div></div>
    </div>
  );
}

export default ShortQuizPage;
