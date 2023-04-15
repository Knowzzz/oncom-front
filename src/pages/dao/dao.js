import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Dao = () => {
  const { daoId } = useParams();
  const [currentDaoId, setCurrentDaoId] = useState(null);

  useEffect(() => {
    setCurrentDaoId(daoId);
  })

}

export default Dao;