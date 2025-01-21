import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import CreateListModal from "./CreateListModal";

const CreateListButton = () => {
  const user = useSelector((state) => state.session.user);

  if (!user || user.username === "admin") return null;

  return (
    <OpenModalButton
      modalComponent={<CreateListModal />}
      buttonText="+ Create List"
    />
  );
};

export default CreateListButton;