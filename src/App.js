import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import MainCommunity from "./component/community/MainCommunity";
import PostWritePage from "./component/community/PostWritePage";
import PostViewPage from "./component/community/PostViewPage";
import Button from "./component/community/ui/Button";

import BoardUpdate from "./component/community/BoardUpdate";
import Editor from "./component/Editor/editor";
import Footer from "./component/footer/footer";
import Headerbar from "./component/header/Header";
import Main from "./component/Main/main";
import QuizPage from "./component/OX_quiz/QuizPage";
import ShortQuizPage from "./component/ShortQuiz/shortQuiz";
import ProblemForm from "./component/Manage_problem/create_problem";
import LoginHome from "./component/Login/LoginHome";
import Manage from "./component/Manage_problem/manage";
import DeleteForm from "./component/Manage_problem/delete_problem";
import ProblemEditForm from "./component/Manage_problem/edit_problem";
import PostEditPage from "./component/community/PostEditPage";

import Blank from "./component/problemlist/problemlist_blank";
import Code from "./component/problemlist/problemlist_code";
import Select from "./component/problemlist/problemlist_select";



const MainTitleText = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  margin-left: 360px;
  color: navy;
`;

// function App(props){
class App extends React.Component {
  render() {
    return (
      //<BrowserRouter>
      //   <MainTitleText> COMMUNITY </MainTitleText>
      <Router>
        <Headerbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/loginhome" element={<LoginHome />} />
          <Route path="/problem/:id" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/oxquiz/:id" element={<QuizPage />} />
          <Route path="/shortquiz/:id" element={<ShortQuizPage />} />
          <Route path="/Manage" element={<Manage />} />
          <Route path="/create_problem" element={<ProblemForm />} />
          <Route path="/delete_problem" element={<DeleteForm />} />
          <Route path="/edit_problem/:id" element={<ProblemEditForm />} />
          <Route path="/qna" element={<MainCommunity />} />
          <Route path="post-write" element={<PostWritePage />} />
          <Route path="post/:postId" element={<PostViewPage />} />
          <Route path="/update/:postId" element={<PostEditPage />}/>
          <Route path="/codeproblemlist" element={<Code />}/>
          <Route path="/blankproblemlist" element={<Blank />}/>
          <Route path="/selectproblemlist" element={<Select />}/>
        </Routes>
        <Footer />
      </Router>
      // </BrowserRouter>
    );
  }
}
export default App;
