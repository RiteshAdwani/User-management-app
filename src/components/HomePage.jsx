import { logout } from "../redux/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const user = useSelector((state) => state.user.userInfo[0]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column">
      <nav className="navbar bg-light home-navbar">
        <a className="navbar-brand" href="#">
          Dashboard
        </a>
        <button
          className="btn btn-primary"
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
        >
          Logout
        </button>
      </nav>

      <div className="user-card text-white text-center">
        <img
          src={user.profile}
          alt="user"
          height="200px"
          className="profile-img bg-white rounded-circle mb-3"
        />
        <p>Hello {user.name}</p>
        <p>You are registered with the email id - {user.email}</p>
        <p>and phone number - +{user.phoneNo}</p>
      </div>
    </div>
  );
};

export default HomePage;
