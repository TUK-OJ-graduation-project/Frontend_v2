import "./quiz.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import tino from "./tino2.png";

function QuizPage() {
  const [problemData, setProblemData] = useState({});
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");

  const { id } = useParams();

  useEffect(() => {
    fetchProblemById(id);
  }, [id]);

  const fetchProblemById = (problemId) => {
    axios
      .get(`http://127.0.0.1:8000/api/v2/ox/${problemId}/`) // Updated URL
      .then((response) => {
        setProblemData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAnswerSubmit = (answer) => {
    const correct = answer === problemData.is_correct;
    setIsCorrect(correct);
    setUserAnswers((prevAnswers) => [...prevAnswers, correct]);
    setFeedback(correct ? "정답입니다!" : "틀렸습니다.");
  };

  const loadNextProblem = () => {
    const nextProblemId = parseInt(problemData.id) + 1;
    fetchProblemById(nextProblemId);
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
    <div className="quiz-container">
      <div className="tino-image">
        <img src={tino} alt="Tino" className="quiz-tino" />
      </div>
      <div className="qzproblem-container">
        {problemData.title && (
          <div key={problemData.id}>
            <p className="qzproblem-container2">{problemData.title}</p>
            <p className="qzproblem-container2">{problemData.description}</p>
          </div>
        )}
      </div>
      <div className="answer-container">
        <button className="answer-btn" onClick={() => handleAnswerSubmit(true)}>
          O
        </button>
        <button
          className="answer-btn"
          onClick={() => handleAnswerSubmit(false)}
        >
          X
        </button>
      </div>
      <p className="feedback">{feedback}</p>
      {renderNextButton()}
    </div>
  );
}

export default QuizPage;
