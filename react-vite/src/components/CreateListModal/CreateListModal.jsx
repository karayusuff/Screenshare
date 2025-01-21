import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateList } from "../../redux/lists";
import './CreateListModal.css'

const CreateListModal = () => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(thunkCreateList({ name }));
    if (result && result.errors) {
      setErrors(result.errors);
    } else {
      closeModal();
    }
  };

  return (
    <div className="create-list-modal">
      <h2>Create a New List</h2>
      {errors.general && <p className="error-message">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          List Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p className="error-message">{errors.name}</p>}
        <button type="submit" disabled={!name.trim()}>
          Create List
        </button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateListModal;
