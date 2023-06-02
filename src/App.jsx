import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import NotFoundPage from "./components/NotFoundPage";
import HomePage from "./components/HomePage";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const App = () => {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn);

  return (
    <div className="container">
      <ToastContainer />
      {location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/signup" ? (
        <div className="d-flex justify-content-center align-items-center w-auto bg-light rounded-4">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/signup"
              element={!isLoggedIn ? <SignupPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      ) : null}

      {location.pathname === "/home" ? (
        <Routes>
          <Route
            path="/home"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/signup" />}
          />
        </Routes>
      ) : null}

      {location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/home" &&
        location.pathname !== "/signup" && (
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
    </div>
  );
};

export default App;
