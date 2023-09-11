import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonTable from "../community/table/CommonTable";
import CommonTableColumn from "../community/table/CommonTableColumn";
import CommonTableRow from "../community/table/CommonTableRow";
import Pagination from "../../Pagination";
import styled from "styled-components";
import { Link } from "react-router-dom";  

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

const OX = () => {
  const [dataList, setDataList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://127.0.0.1:8000/api/v2/ox/list/";
      try {
        const response = await axios.get(url);
        setDataList(response.data.reverse());
      } catch (error) {
        console.error("Error fetching data from API:", error.response);
      }
    };

    fetchData();
  }, [page]);

  const sortedData = [...dataList].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const slicedData = sortedData.slice(offset, offset + limit);

  return (
    <Wrapper>
      <Container>
        <h1 style={{ color: "grey", marginTop: 30, marginBottom: 30, fontSize: 30, fontWeight: "bold" }}>
          O/X 퀴즈 LIST
        </h1>
        <div
          style={{
            background: "#000066",
            marginTop: 100,
            borderRadius: 10,
          }}
        >
          <CommonTable headersName={["Problem No.", "Title"]}>
            {slicedData.map((problem, index) => (
              <CommonTableRow key={problem.id}>
                <CommonTableColumn>{offset + index + 1}</CommonTableColumn>
                <CommonTableColumn>
                  {/* Link the problem title to its detail page */}
                  <Link to={`/oxQuiz/${problem.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {problem.title}
                  </Link>
                </CommonTableColumn>
              </CommonTableRow>
            ))}
          </CommonTable>
        </div>
        <div>
          <Pagination total={sortedData.length} limit={limit} page={page} setPage={setPage} />
        </div>
      </Container>
    </Wrapper>
  );
};

export default OX;
