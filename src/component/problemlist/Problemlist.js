import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonTable from "../community/table/CommonTable";
import CommonTableColumn from "../community/table/CommonTableColumn";
import CommonTableRow from "../community/table/CommonTableRow";
import Pagination from "../../Pagination";
import styled from "styled-components";

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

const ProblemList = () => {
  const [problem, setProblem] = useState("");
  const [level, setLevel] = useState("");
  const [dataList, setDataList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  const handlechangeproblem = (event) => {
    const selectedProblem = event.target.value;
    setProblem(selectedProblem);
  };

  const handlechangelevel = (event) => {
    const selectedLevel = event.target.value;
    setLevel(selectedLevel);
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://127.0.0.1:8000/api/v1/problems/list/?type=${problem}&level=${level}`;
      try {
        const response = await axios.get(url);
        setDataList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [problem, level]);

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://127.0.0.1:8000/api/v1/problems/list/";
      try {
        const response = await axios.get(url);
        setDataList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [page]);

  const filteredData = dataList.filter((problemItem) => {
    if (problem === "" && level === "") {
      return true;
    } else if (problem !== "" && level === "") {
      return problemItem.type === problem && problemItem.level !== "select" && problemItem.type !== "O/X";
    } else if (problem === "" && level !== "") {
      return problemItem.level === level && problemItem.type !== "select" && problemItem.type !== "O/X";
    } else {
      return problemItem.type === problem && problemItem.level === level && problemItem.type !== "select" && problemItem.level !== "select" && problemItem.type !== "blank";
    }
  });

  const slicedData = filteredData.slice(offset, offset + limit);

  return (
    <Wrapper>
      <Container>
        <h1 style={{ color: "grey", marginTop: 30, marginBottom: 30, fontSize: 30, fontWeight: "bold" }}>
          PROBLEM LIST
        </h1>
        <div>
          <label style={{ borderRadius: 30 }}>
            <select
              style={{ textAlign: "center", width: 100, height: 30, float: "right", fontSize: 15 }}
              value={problem}
              onChange={handlechangeproblem}
            >
              <option value="">전체(유형)</option>
              <option value="code">code</option>
              <option value="blank">blank</option>
              <option value="select">select</option>
            </select>
          </label>
          <label style={{ borderRadius: 30 }}>
            <select
              style={{ textAlign: "center", width: 100, height: 30, float: "right", fontSize: 15 }}
              value={level}
              onChange={handlechangelevel}
            >
              <option value="">전체(레벨)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>
        <div
          style={{
            background: "#000066",
            marginTop: 100,
            borderRadius: 10,
          }}
        >
          <CommonTable headersName={["ID", "문제명", "레벨", "유형"]}>
            {slicedData.map((problem) => (
              <CommonTableRow key={problem.id} problemType={problem.type}>
                <CommonTableColumn>{problem.id}</CommonTableColumn>
                <CommonTableColumn>{problem.title}</CommonTableColumn>
                <CommonTableColumn>{problem.level}</CommonTableColumn>
                <CommonTableColumn>{problem.type}</CommonTableColumn>
              </CommonTableRow>
            ))}
          </CommonTable>
        </div>
        <div>
          <Pagination total={filteredData.length} limit={limit} page={page} setPage={setPage} />
        </div>
      </Container>
    </Wrapper>
  );
};

export default ProblemList;
