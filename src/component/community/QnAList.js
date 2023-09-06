import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../Pagination";
import Button from "./ui/Button";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import PostViewPage from "./PostViewPage";
import { MdQuestionAnswer } from "react-icons/md";
import CommonTable from "./table/CommonTable";
import CommonTableRow from "./table/CommonTableRow";
import CommonTableColumn from "./table/CommonTableColumn";

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

function QnAList(props) {
  const [qnaData, setQnaDataList] = useState([]); // 초기 빈 배열로 설정
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  const navigate = useNavigate();
  const { posts, onClickItem } = props; //post map 위해서 추가

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v2/qna/questions/")
      .then(function (response) {
        console.log(response.data);
        setQnaDataList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [page]);
  const slicedData = qnaData.slice(offset, offset + limit);

  return (
    <Wrapper>
      <Container>
        <h1
          style={{
            color: "grey",
            marginTop: 30,
            marginBottom: 30,
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          QnA
        </h1>
        <Button
          title="글 작성하기"
          onClick={() => {
            navigate("/post-write");
          }}
        />
        <div
          style={{
            background: "#a0a0a0",
            marginTop: 10,
            borderRadius: 10,
          }}
        >
          <CommonTable headersName={["No", "Title"]}>
            {slicedData.map((qna, index) => (
              <CommonTableRow key={qna.id}>
                <CommonTableColumn>{offset + index + 1}</CommonTableColumn>
                <CommonTableColumn>
                  {qna.id && <Link to={`/qna/${qna.id}`}>{qna.title}</Link>}
                </CommonTableColumn>
              </CommonTableRow>
            ))}
          </CommonTable>
        </div>

        <div>
          <Pagination
            total={qnaData.length}
            limit={limit}
            page={page}
            setPage={setPage}
          />
        </div>
      </Container>
    </Wrapper>
  );
}

export default QnAList;
