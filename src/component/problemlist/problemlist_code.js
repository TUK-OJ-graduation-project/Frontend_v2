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

const Code = () => {
  const [dataList, setDataList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://127.0.0.1:8000/api/v1/problems/list/?type=code";
      try {
        const response = await axios.get(url);
        setDataList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const filteredData = dataList.filter((problemItem) => problemItem.type === "code");

  const slicedData = filteredData.slice(offset, offset + limit);

  return (
    <Wrapper>
      <Container>
        <h1 style={{ color: "grey", marginTop: 30, marginBottom: 30, fontSize: 30, fontWeight: "bold" }}>
          PROBLEM LIST
        </h1>
        <div
          style={{
            background: "#000066",
            marginTop: 100,
            borderRadius: 10,
          }}
        >
          <CommonTable headersName={["ID", "문제명", "레벨"]}>
            {slicedData.map((problem) => (
              <CommonTableRow key={problem.id}>
                <CommonTableColumn>{problem.id}</CommonTableColumn>
                <CommonTableColumn>{problem.title}</CommonTableColumn>
                <CommonTableColumn>{problem.level}</CommonTableColumn>
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

export default Code;
