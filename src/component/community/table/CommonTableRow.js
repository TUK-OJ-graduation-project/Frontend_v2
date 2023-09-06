import React from "react";
import { useNavigate } from "react-router";

const CommonTableRow = ({ children, id }) => {
  const navigator = useNavigate();

  const handleRowClick = () => {
    navigator(`/post/${id}`);
  };

  return (
    <tr className="common-table-row" onClick={handleRowClick}>
      {children}
    </tr>
  );
};

export default CommonTableRow;
