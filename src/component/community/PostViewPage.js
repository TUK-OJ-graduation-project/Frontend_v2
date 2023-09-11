import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styled from "styled-components";
import CommentList from "../community/CommentList";
import Button from "./ui/Button";
import data from "../../data.json";
import { useLocation } from "react-router";
import ReactHtmlParser from "html-react-parser";
import axios from "axios";

const Wrapper = styled.div`
  padding: 16px;
  margin: 20px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin-bottom: 20px;

  & > * {
    :not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

const PostContainer = styled.div`
  padding: 8px 16px;
  margin: 20;
  border: 1px solid grey;
  border-radius: 20px;
`;

const TitleText = styled.p`
  font-size: 20px;
  font-weight: 500;

  color: navy;
  font-weight: bold;
`;
const Writer = styled.p`
  font-size: 14px;
  color: black;
`;
const ContentText = styled.p`
  font-size: 15px;
  color: black;
  line-height: 32px;
  padding: 16px;
  white-space: pre-wrap;
`;

const CommentLabel = styled.p`
  font-size: 16px;
  padding: 16px;
  color: black;
  font-weight: 500;
`;

function PostViewPage(props) {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const { state } = useLocation();

  //게시글 수정
  const moveToUpdate = () => {
    navigate("/update/" + postId);
  };
  // 게시글 삭제
  const deleteBoard = async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      await axios
        .delete(`http://127.0.0.1:8000/api/v2/qna/questions/${postId}/`)
        .then((res) => {
          alert("삭제되었습니다.");
          navigate("/qna");
        });
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v2/qna/questions/${postId}/`
      );
      if (response.status === 200) {
        setPost(response.data);
      } else {
        console.error(
          "Failed to fetch post, response status: ",
          response.status
        );
      }
    } catch (error) {
      console.error("Failed to fetch post: ", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const addComment = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v2/qna/answers/`,
        {
          answer: comment,
          question: postId,
        }
      );

      if (response.status === 201) {
        setComment(""); //댓글 작성 후에 입력부분 다시 새로고침
        fetchPost();
      } else {
        console.error(
          "Failed to create comment, response status: ",
          response.status
        );
      }
    } catch (error) {
      console.error("댓글 생성에 실패: ", error);
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
    }
  };
  return (
    <Wrapper>
      <Container>
        <div id="QnA" className="pagename">
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
        </div>
      </Container>
      <Container>
        <Button
          title="뒤로 가기"
          onClick={() => {
            navigate("/qna");
          }}
        />
      </Container>
      <Container>
        <PostContainer style={{ background: "lightgrey" }}>
          <div
            style={{
              display: "flex",
              margin: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TitleText>{state.title}</TitleText>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Writer>작성자</Writer>
              <img
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  margin: 20,
                  border: "1px",
                }}
                src={require("../community/tino.png")}
              />
            </div>
          </div>
          <hr
            style={{ border: "0.5px solid grey", margin: 10, marginTop: 10 }}
          />
          <ContentText style={{ color: "black" }}>
            {post ? ReactHtmlParser(post.question) : "질문글 로딩중...."}
          </ContentText>
          <hr
            style={{ border: "0.5px solid grey", margin: 10, marginTop: 10 }}
          />
          <CommentLabel>Comment</CommentLabel>
          {post ? (
            <CommentList comments={post.answers} />
          ) : (
            <p> 댓글 로딩중 ...</p>
          )}
          <form style={{ padding: 16 }} onSubmit={addComment}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="답변댓글 작성"
            />
            <Button title="댓글 작성" type="submit" />
          </form>
        </PostContainer>
        <Button title="삭제" onClick={deleteBoard} />
        <Link to={`/update/${postId}`}>
          <Button title="수정" onClick={moveToUpdate} />
        </Link>
      </Container>
    </Wrapper>
  );
}

export default PostViewPage;
