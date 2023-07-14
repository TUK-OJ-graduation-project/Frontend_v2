import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./problem.css";

const Wrapper = styled.div`
  padding: 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  & > * {
    :not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f8f8;
  padding: 8px;
  border-radius: 4px;
`;

const Manage = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/problems/list/"
      );
      setDataList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProblem = async (id, type) => {
    try {
      let deleteUrl;
      if (type === "code") {
        deleteUrl = `http://127.0.0.1:8000/api/v1/problems/code/${id}`;
      } else if (type === "select") {
        deleteUrl = `http://127.0.0.1:8000/api/v1/problems/select/${id}`;
      } else if (type === "blank") {
        deleteUrl = `http://127.0.0.1:8000/api/v1/problems/blank/${id}`;
      }

      await axios.delete(deleteUrl);
      const updatedDataList = dataList.filter((problem) => problem.id !== id);
      setDataList(updatedDataList);
      alert("문제가 성공적으로 삭제되었습니다!");
    } catch (error) {
      console.log(error);
      alert("문제 삭제에 실패했습니다.");
    }
  };

  return (
    <Wrapper>
      <Container>
        <h1
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "grey",
            marginTop: 30,
            marginBottom: 30,
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          <span>PROBLEM LIST</span>
          <Link to="/create_problem">
            <button className="create-problem-btn">문제생성</button>
          </Link>
        </h1>
        {dataList.map((problem) => (
          <ListItem key={problem.id}>
            <div>
              <strong>ID:</strong> {problem.id}
            </div>
            <div>
              <strong>문제유형:</strong> {problem.type}
            </div>
            <div>
              <strong>문제명:</strong> {problem.title}
            </div>
            <div>
              <strong>난이도:</strong> {problem.level}
            </div>
            <div>
              <strong>언어:</strong> {problem.language}
            </div>
            <div>
              <Link to={`/edit_problem/${problem.id}`}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button
                className="delete-btn"
                onClick={() => deleteProblem(problem.id, problem.type)}
              >
                Delete
              </button>
            </div>
          </ListItem>
        ))}
      </Container>
    </Wrapper>
  );
};

export default Manage;
