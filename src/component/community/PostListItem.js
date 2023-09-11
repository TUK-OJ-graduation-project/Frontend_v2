// 메인qna 아이템 하나하나
import React from "react";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";

const Wrapper = styled.div`
  width: 70%;
  padding: 16px;
  margin-left: 15%;
  margin-right: 15%;
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  :hover {
    background: grey;
  }
`;

const TitleText = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: navy;
  font-weight: bold;
`;

const Writer = styled.p`
  font-size: 10px;
  font-weight: 500;
  color: navy;
  font-weight: bold;
`;

function PostListItem(props) {
  const { post, onClick } = props;
  return (
    <Wrapper onClick={onClick} style={{ flexDirection: "row-reverse" }}>
      <img
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "1px",
        }}
        src={require("../community/tino.png")}
      />
      <Writer>작성자</Writer>

      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <TitleText>{post.title}</TitleText>
        {post ? ReactHtmlParser(post.question) : "질문글 로딩중...."}
      </div>
    </Wrapper>
  );
}

export default PostListItem;
