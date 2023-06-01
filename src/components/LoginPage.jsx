import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/login-illu.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../redux/user/userActions";
import CryptoJS from "crypto-js";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

// password decryption function
const decryption = (password) => {
  const decrypted = CryptoJS.AES.decrypt(
    password,
    import.meta.env.VITE_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  return decrypted;
};

// password encryption function
const encryption = (password) => {
  const encrypted = CryptoJS.AES.encrypt(
    password,
    import.meta.env.VITE_SECRET_KEY
  ).toString();

  return encrypted;
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = JSON.parse(localStorage.getItem("userLoginData"));
  let userLoginData;

  const onSubmit = (values, { resetForm }) => {
    const registeredUser = users.find((user) => user.email === values.email);
    if (!registeredUser) {
      toast.error("User does not exist", {
        position: toast.POSITION.TOP_CENTER,
        transition: Slide,
        autoClose: 1000,
      });
      return;
    } else if (
      registeredUser &&
      decryption(registeredUser.password) !== values.password
    ) {
      toast.error("Invalid password", {
        position: toast.POSITION.TOP_CENTER,
        transition: Slide,
        autoClose: 1000,
      });
      return;
    } else {
      userLoginData = {
        email: values.email,
        password: encryption(values.password),
      };
      dispatch(login(userLoginData));
      navigate("/home");
      resetForm();
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <div className="d-flex flex-sm-row flex-column justify-content-between align-items-center p-md-5 p-3 w-100">
        <div className="login-form d-flex flex-column">
          <h1>Login</h1>
          <Form>
            <div className="my-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field
                type="email"
                className="input-field form-control"
                id="email"
                placeholder="Enter your email"
                name="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                type="password"
                className="input-field form-control"
                id="password"
                placeholder="Enter password"
                name="password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              Login
            </button>

            <div className="mt-2">
              <p>
                Don&apos;t have an account?{" "}
                <Link to="/" className="text-decoration-none">
                  Sign Up
                </Link>
              </p>
            </div>
          </Form>
        </div>

        <div className="w-50">
          <img
            src={loginImg}
            alt="Login Illustration"
            className="img-fluid"
            width="500px"
          />
        </div>
      </div>
    </Formik>
  );
};

export default LoginPage;
