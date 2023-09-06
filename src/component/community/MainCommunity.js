// 메인 qna 페이지
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Route, Routes, useParams, Link } from "react-router-dom";
import styled from "styled-components";
import PostList from "./Postlist";
// import Problemlist from "../list/Problemlist";
import Button from "./ui/Button";
import Pagination from "../../Pagination";
// import data from "../../data.json";
import "../community/Paging.css";
import axios from "axios";

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
  max-width: 720px;
  & > * {
    :not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

function MainCommunity(props) {
  const {} = props;
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { postId } = useParams();

  const [qnaData, setQnaDataList] = useState([]);

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
  }, [page]); // 'page'페이지가 변경될 대마다 구성 요소가 다시 렌더링되고 백엔드에서 최신 데이터를 가져오도록 종속성이 추가

  const slicedQnaData = qnaData.slice(offset, offset + limit); // 슬라이싱된 데이터

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
      </Container>
      <Container>
        <Button
          title="글 작성하기"
          onClick={() => {
            navigate("/post-write");
          }}
        />
        {/* 목록 */}
        <div
          style={{
            backgroundColor: "lightgrey",
            borderRadius: 20,
            width: "100%",
            marginRight: "32px",
            border: "1px solid grey",
          }}
        >
          <PostList
            posts={slicedQnaData}
            onClickItem={(item) => {
              navigate(`/post/${item.id}`, { state: item });
            }}
          />
        </div>
      </Container>

      <div>
        <Pagination
          total={qnaData.length}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </div>
    </Wrapper>
  );
}

export default MainCommunity;
