import { useNavigate } from "react-router-dom";

export const useNavigateTo = (pathPrefix) => {
  const navigate = useNavigate();

  return (id) => {
    navigate(`/${pathPrefix}/${id}`);
  };
};