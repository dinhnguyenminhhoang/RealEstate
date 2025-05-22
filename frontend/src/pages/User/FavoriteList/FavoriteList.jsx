import React, { useEffect, useState } from "react";
import { userGetAllFavoriteList } from "../../../services/userService";

const FavoriteList = () => {
  const [listPost, setListPost] = useState([]);
  const [pagi, setPagi] = useState({
    limit: 4,
    page: 1,
    total: 1,
    totalPages: 1,
  });
  const fetchData = async () => {
    const res = await userGetAllFavoriteList();
    if (res.status === 200) {
      setListPost(res.data.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log("listPost", listPost);
  return <div>FavoriteList</div>;
};

export default FavoriteList;
