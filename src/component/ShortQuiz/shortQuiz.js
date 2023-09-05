import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../OX_quiz/quiz.css";
import tino from "../OX_quiz/tino2.png";

function ShortQuizPage() {
  const [problemData, setProblemData] = useState({});
  const id = useParams().id;

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/v2/blank/${id}/`)
      .then(function (response) {
        setProblemData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const [userAnswer, setUserAnswer] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleAnswerSubmit = () => {
    axios
      .post(`http://127.0.0.1:8000/api/v2/blank/check-answer/${id}/`, {
        answer: inputValue.trim(),
      })
      .then(function (response) {
        if (response.data.correct) {
          setFeedback("정답입니다");
          setUserAnswer(inputValue);
          setInputValue("");
        } else {
          setFeedback("틀렸습니다");
          setUserAnswer("");
          setInputValue("");
        }
      })
      .catch((error) => {
        console.error("Error while checking answer:", error);
        if (error.response) {
          console.error("Data:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
        }
      });
  };

  const loadNextProblem = () => {
    const nextProblemId = parseInt(id) + 1;
    axios
      .get(`http://127.0.0.1:8000/api/v2/blank/${nextProblemId}/`)
      .then(function (response) {
        setProblemData(response.data);
        setUserAnswer("");
        setInputValue("");
        setFeedback(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="quiz-container">
      <div className="tino-image">
        <img src={tino} className="quiz-tino" alt="Tino" />
      </div>
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
      {feedback === "정답입니다" && (
        <button className="next-btn" onClick={loadNextProblem}>
          다음
        </button>
      )}

      <div></div>
    </div>
  );
}

export default ShortQuizPage;
