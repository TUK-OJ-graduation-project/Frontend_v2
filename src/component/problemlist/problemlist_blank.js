import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonTable from "../community/table/CommonTable";
import CommonTableColumn from "../community/table/CommonTableColumn";
import CommonTableRow from "../community/table/CommonTableRow";
import Pagination from "../../Pagination";
import styled from "styled-components";
import { Link } from 'react-router-dom';  // Added this line

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

const Blank = () => {
   const [dataList, setDataList] = useState([]);
   const [limit, setLimit] = useState(10);
   const [page, setPage] = useState(1);
   const offset = (page - 1) * limit;

   useEffect(() => {
     const fetchData = async () => {
       const url = `http://127.0.0.1:8000/api/v2/blank/`;
       try {
         const response = await axios.get(url);
         setDataList(response.data.reverse());
       } catch (error) {
         console.log(error);
       }
     };

     fetchData();
   }, [page]);

   const slicedData = dataList.slice(offset, offset + limit);

   return (
     <Wrapper>
       <Container>
         <h1 style={{ 
             color: "grey", 
             marginTop: 30, 
             marginBottom: 30, 
             fontSize: 30, 
             fontWeight: "bold" 
         }}>
           빈칸 문제 LIST
         </h1>
         <div style={{
             background: "#000066",
             marginTop: "100px",
             borderRadius: 10
           }}>
           <CommonTable headersName={["Problem No.", "Title"]}>
             {slicedData.map((problem, index) => (
               <CommonTableRow key={problem.id}>
                 {/* Display the problem number based on the index */}
                 <CommonTableColumn>{offset + index + 1}</CommonTableColumn>
                 {/* Modified this line to link the problem title to its solving page */}
                 <CommonTableColumn>
                   <Link to={`/problems/blank/${problem.id}`}>
                     {problem.title}
                   </Link>
                 </CommonTableColumn>
               </CommonTableRow>
             ))}
           </CommonTable>
         </div>
         <div>
           <Pagination total={dataList.length} limit={limit} page={page} setPage={setPage} />
         </div>
       </Container>
     </Wrapper>
   );
};

export default Blank;
