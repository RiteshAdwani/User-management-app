import { Link, useNavigate } from "react-router-dom";
import signupImg from "../assets/signup-illu.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp, login } from "../redux/user/userActions";
import CryptoJS from "crypto-js";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  name: "",
  email: "",
  phoneNo: "",
  password: "",
  confirmPassword: "",
  profile: "",
};

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(15, "Atleast 15 characters are required!"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  phoneNo: Yup.string()
    .required("Phone number is required!")
    .matches(/^\91[1-9]\d{9}$/, "Invalid phone number"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), ""], "Passwords do not match"),
  profile: Yup.mixed()
    .required("Profile picture is required")
    .test("fileSize", "Too Big! Image only up to 2 MB is allowed", (value) => {
      if (value && value.size) {
        const fileSizeInMB = value.size / 1024 / 1024;
        return fileSizeInMB <= 2;
      }
      return true;
    })
    .test(
      "fileType",
      "Invalid File Format! Only png,jpeg/jpg format is allowed",
      (value) => {
        if (value && value.type) {
          return ["image/png", "image/jpeg", "image/jpg"].includes(value.type);
        }
        return true;
      }
    ),
});

const encryption = (password) => {
  const encrypted = CryptoJS.AES.encrypt(
    password,
    import.meta.env.VITE_SECRET_KEY
  ).toString();

  return encrypted;
};

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const users = useSelector((state) => state.user.users);

  const onSubmit = (values, { resetForm }) => {
    const reader = new FileReader();
    reader.onload = () => {
      const user = {
        ...values,
        profile: reader.result,
        password: encryption(values.password),
      };
      const isExistingUser = users?.filter(
        (user) => user.email === values.email
      );

      if (isExistingUser[0]) {
        //If the email is already registered,show toast error
        toast.error("This email is already registered", {
          position: toast.POSITION.TOP_CENTER,
          transition: Slide,
          autoClose: 1000,
        });
        return;
      } else {
        // Dispatch the signup action
        dispatch(signUp(user));
        dispatch(
          login({ email: values.email, password: encryption(values.password) })
        );
        navigate("/home");
        // Reset the form fields
        resetForm();
        setImagePreview(null);
      }
    };
    if (values.profile) {
      reader.readAsDataURL(values.profile);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-sm-5 px-1 py-3 w-100">
          <div className="signup-form d-flex flex-column">
            <h1>SignUp</h1>
            <Form>
              <div>
                <label
                  htmlFor="user-img"
                  className="d-flex justify-content-center"
                  role="button"
                >
                  Photo +
                </label>
                <input
                  className="d-none"
                  type="file"
                  id="user-img"
                  accept="image/*"
                  name="profile"
                  onChange={(event) => {
                    formik.setFieldValue(
                      "profile",
                      event.currentTarget.files[0]
                    );
                    handleImageChange(event);
                  }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Selected"
                    id="img-preview"
                    className="rounded-circle d-block mx-auto"
                    height="110px"
                    width="110px"
                  />
                )}
              </div>
              <ErrorMessage name="profile">
                {(msg) => (
                  <div className="text-center error-message">{msg}</div>
                )}
              </ErrorMessage>

              <div className="mb-2">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  className="input-field form-control mb-1"
                  id="name"
                  placeholder="Enter full name"
                  name="name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  className="input-field form-control mb-1"
                  id="email"
                  placeholder="example123@gmail.com"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="phoneNo">PhoneNo</label>
                <Field
                  type="text"
                  className="input-field form-control mb-1"
                  id="phoneNo"
                  placeholder="+91 XXX XXXX XXX"
                  name="phoneNo"
                />
                <ErrorMessage
                  name="phoneNo"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  className="input-field form-control mb-1"
                  id="password"
                  placeholder="Enter Password"
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  className="input-field form-control mb-1 p-2"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Enter Password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="error-message"
                />
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
              <button
                type="reset"
                className="btn btn-danger ms-3 mt-3"
                onClick={handleReset}
              >
                Reset
              </button>

              <div className="mt-3">
                <p>
                  Already have an account?
                  <Link to="/login" className="text-decoration-none ms-1">
                    Login
                  </Link>
                </p>
              </div>
            </Form>
          </div>

          <div className="w-50">
            <img
              src={signupImg}
              alt="SignUp Illustration"
              className="img-fluid"
              width="500px"
            />
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignupPage;
