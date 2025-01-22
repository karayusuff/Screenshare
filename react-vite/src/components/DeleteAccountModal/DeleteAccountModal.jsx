import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteAccount } from "../../redux/session";
import "./DeleteAccountModal.css";

const DeleteAccountModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    const result = await dispatch(thunkDeleteAccount());
    if (!result?.error) {
      closeModal();
      window.location.href = "/";
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="delete-account-modal">
      <h2>Are you sure?</h2>
      <p>This action cannot be undone. Your account and all associated data will be permanently deleted.</p>
      <div className="modal-actions">
        <button onClick={handleDelete} className="delete-button">Yes, Delete</button>
        <button onClick={closeModal} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
