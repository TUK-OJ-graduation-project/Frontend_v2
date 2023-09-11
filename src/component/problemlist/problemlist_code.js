import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonTable from "../community/table/CommonTable";
import CommonTableColumn from "../community/table/CommonTableColumn";
import CommonTableRow from "../community/table/CommonTableRow";
import Pagination from "../../Pagination";
import styled from "styled-components";
import { Link } from "react-router-dom";  // import Link from react-router-dom

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
   const [dataList, setDataList] = useState([]);
   const [limit, setLimit] = useState(10);
   const [page, setPage] = useState(1);
   const offset = (page - 1) * limit;

   useEffect(() => {
     const fetchData = async() => {
       const url = "http://localhost:8000/api/v2/problems/";
       try {
         const response = await axios.get(url);
         setDataList(response.data.reverse());
       } catch (error) {
         console.log(error);
       }
     };

     fetchData();
   }, [page]);

   const filteredData = dataList.filter((problemItem) => problemItem.language === "PY");
   const slicedData = filteredData.slice(offset, offset + limit);

   return (
     <Wrapper>
       <Container>
         <h1 style={{ color: "grey", marginTop: 30, marginBottom: 30, fontSize: 30, fontWeight: "bold" }}>
           코딩 문제 LIST
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
                   <Link to={`/editor/${problem.id}`}>{problem.title}</Link>
                 </CommonTableColumn>
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