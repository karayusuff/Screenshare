import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import CreateListModal from "./CreateListModal";
import LoginFormModal from "../LoginFormModal";
import './CreateListButton.css'

const CreateListButton = () => {
  const user = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();

  const handleClick = () => {
    if (!user) {
      setModalContent(<LoginFormModal />);
    } else {
      setModalContent(<CreateListModal />);
    }
  };

  return (
    <button
      className="create-list-button"
      onClick={handleClick}
    >
      + Create List
    </button>
  );
};

export default CreateListButton;