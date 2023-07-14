import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./problem.css";

function ProblemForm() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState({
    level: "",
    type: "",
    title: "",
    description: "",
    input_format: "",
    output_format: "",
    hint: "",
    language: [],
    is_correct: false,
    blank_answer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    const currentLanguages = [...problem.language];
    if (isChecked) {
      currentLanguages.push(value);
    } else {
      const index = currentLanguages.indexOf(value);
      if (index > -1) {
        currentLanguages.splice(index, 1);
      }
    }
    setProblem((prevState) => ({ ...prevState, language: currentLanguages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProblem = {
      level: problem.level,
      type: problem.type,
      title: problem.title,
      description: problem.description,
      input_format: problem.input_format,
      output_format: problem.output_format,
      hint: problem.hint,
      language: problem.language.toString(),
      blank_answer: problem.blank_answer,
    };

    if (problem.type === "select") {
      newProblem["is_correct"] = false;
    } else if (problem.type === "blank") {
      newProblem["blank_answer"] = problem.blank_answer;
    }

    try {
      await axios.post(`http://127.0.0.1:8000/api/v1/problems/`, newProblem);
      alert("문제가 성공적으로 등록되었습니다!");
      navigate("/manage"); // manage 페이지로 이동
    } catch (error) {
      console.log(error);
      alert("문제 등록에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <form method="post" onSubmit={handleSubmit}>
        <h3>Add Problem</h3>
        <br />
        <div className="container2">
          <label htmlFor="type" className="type"></label>
          <select
            id="type"
            name="type"
            defaultValue=""
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>
              문제 유형
            </option>
            <option value="code">코드 문제</option>
            <option value="select">O / X 문제</option>
            <option value="blank">빈칸 문제</option>
          </select>
          <div>
            <label htmlFor="title">Title</label>
            <textarea
              type="text"
              id="title"
              name="title"
              value={problem.title}
              placeholder="문제 제목"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              id="description"
              name="description"
              value={problem.description}
              placeholder="문제 설명"
              onChange={handleChange}
              required
            />
          </div>
          {problem.type === "code" && (
            <>
              <div>
                <label htmlFor="input_format">Input Format</label>
                <textarea
                  type="text"
                  id="input_format"
                  name="input_format"
                  value={problem.input_format}
                  placeholder="입력 형식"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="output_format">Output Format</label>
                <textarea
                  type="text"
                  id="output_format"
                  name="output_format"
                  value={problem.output_format}
                  placeholder="출력 형식"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="hint">Hint</label>
                <textarea
                  type="text"
                  id="hint"
                  name="hint"
                  value={problem.hint}
                  placeholder="힌트"
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="level" className="level-label">
              Level
            </label>
            <select
              id="level"
              name="level"
              onChange={handleChange}
              defaultValue=""
              required
            >
              <option value="" disabled hidden>
                문제 난이도
              </option>
              <option value="1">level 1</option>
              <option value="2">level 2</option>
              <option value="3">level 3</option>
              <option value="4">level 4</option>
              <option value="5">level 5</option>
            </select>
          </div>
          <div className="flex items-start mb-6">
            <div>Language & Type</div>
            <div className="language-checkbox">
              <label title="GCC 7.5">
                <input
                  type="checkbox"
                  name="language"
                  value="C"
                  checked={problem.language.includes("C")}
                  onChange={handleCheckboxChange}
                />{" "}
                C
              </label>
              <label title="G++ 7.5">
                <input
                  type="checkbox"
                  name="language"
                  value="C++"
                  checked={problem.language.includes("C++")}
                  onChange={handleCheckboxChange}
                />{" "}
                C++
              </label>
              <label title="OpenJDK 1.8">
                <input
                  type="checkbox"
                  name="language"
                  value="JAVA"
                  checked={problem.language.includes("JAVA")}
                  onChange={handleCheckboxChange}
                />{" "}
                Java
              </label>
              <label title="Python 3.6">
                <input
                  type="checkbox"
                  name="language"
                  value="Python3"
                  checked={problem.language.includes("Python3")}
                  onChange={handleCheckboxChange}
                />{" "}
                Python3
              </label>
            </div>
          </div>
          {problem.type === "select" && (
            <div className="flex items-start mb-6">
              <label htmlFor="is_correct">Is Correct:</label>
              <input
                type="checkbox"
                id="is_correct"
                name="is_correct"
                checked={problem.is_correct}
                onChange={handleChange}
              />
            </div>
          )}
          {problem.type === "blank" && (
            <div className="flex items-start mb-6">
              <label htmlFor="blank_answer">Blank Answer:</label>
              <input
                type="text"
                id="blank_answer"
                name="blank_answer"
                value={problem.blank_answer}
                placeholder="빈칸 답안"
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>
        <div className="create-problem-btn">
          <button onClick={handleSubmit} type="button" className="submit-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProblemForm;
