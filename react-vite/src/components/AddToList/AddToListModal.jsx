import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal";
import "./AddToListModal.css";

const AddToListModal = ({ movieId }) => {
  const { closeModal, setModalContent } = useModal();
  const currentUser = useSelector((state) => state.session.user);
  const [lists, setLists] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setModalContent(<LoginFormModal />);
      return;
    }

    const fetchUserLists = () => {
      fetch(`/api/users/${currentUser.id}/lists`)
        .then((res) => res.json())
        .then((data) => {
          const updatedLists = data.Lists.map((list) => ({
            ...list,
            isInList: list.movies.some((movie) => movie.id === parseInt(movieId)),
          }));
          setLists(updatedLists);
          setIsLoading(false);
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.error) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              fetch: data.error,
            }));
          }
          setIsLoading(false);
        });
    };

    fetchUserLists();
  }, [currentUser, movieId, setModalContent]);

  const handleToggleList = (listId, currentStatus) => {
    const method = currentStatus ? "DELETE" : "POST";
    fetch(`/api/lists/${listId}/movies/${movieId}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setLists((prevLists) =>
            prevLists.map((list) =>
              list.id === listId
                ? { ...list, isInList: !currentStatus }
                : list
            )
          );
        } else {
          return res.json().then((data) => {
            if (data && data.error) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                toggle: data.error,
              }));
            }
          });
        }
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            toggle: data.error,
          }));
        }
      });
  };

  if (isLoading) {
    return <div className="modal-content">Loading your lists...</div>;
  }

  if (Object.values(errors).length > 0) {
    return (
      <div>
        {Object.entries(errors).map(([key, message]) => (
          <p key={key}>{message}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="add-to-list-modal">
      <h2>Manage Lists</h2>
      {lists.length === 0 ? (
        <p>You don&apos;t have any lists yet.</p>
      ) : (
        <div className="lists-container">
          {lists.map((list) => (
            <label key={list.id} className="list-item">
              <div className="list-info">
                <span className="list-name">{list.name}</span>
                <span className="list-movie-count">
                  ({list.movies.length} movies)
                </span>
              </div>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={list.isInList}
                  onChange={() => handleToggleList(list.id, list.isInList)}
                />
              </div>
            </label>
          ))}
        </div>
      )}
      <button onClick={closeModal} className="close-button">
        Done
      </button>
    </div>
  );
};

export default AddToListModal;
