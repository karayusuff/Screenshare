import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUpdateProfile } from "../../redux/session";
import { useNavigateTo } from "../../utils/navigation";
import './EditProfileModal.css'

const EditProfileModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const currentUser = useSelector((state) => state.session.user);
  const navigateToUser = useNavigateTo("users");

  const [firstName, setFirstName] = useState(currentUser.first_name || "");
  const [lastName, setLastName] = useState(currentUser.last_name || "");
  const [username, setUsername] = useState(currentUser.username || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [profilePicUrl, setProfilePicUrl] = useState(currentUser.profile_pic_url || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProfile = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      profile_pic_url: profilePicUrl,
      password: password || undefined, // Boşsa güncelleme yapılmasın
    };

    try {
      const result = await dispatch(thunkUpdateProfile(updatedProfile));
      if (result?.error) {
        setErrors(result.error);
      } else {
        closeModal();
        navigateToUser(username);
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, server: "An error occurred. Please try again." }));
    }
  };

  return (
    <div className="edit-profile-modal">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <label>Last Name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Profile Picture URL</label>
          <input value={profilePicUrl} onChange={(e) => setProfilePicUrl(e.target.value)} />
        </div>
        <div>
          <label>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {Object.values(errors).length > 0 && (
          <div className="error-messages">
            {Object.entries(errors).map(([field, message]) => (
              <p key={field}>{message}</p>
            ))}
          </div>
        )}
        <button type="submit">Save Changes</button>
      </form>
      <button onClick={closeModal} className="cancel-button">Cancel</button>
    </div>
  );
};

export default EditProfileModal;

