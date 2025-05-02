import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import generalContent from "../../contents/GeneralContent";
import "./Login.css";
import FormInput from "../../UI/Input/FormInput/FormInput";
import PasswordInput from "../../UI/Input/PasswordInput/PasswordInput";
import CheckBoxInput from "../../UI/Input/CheckBoxInput/CheckBoxInput";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import { checkLogin } from "../../redux/auth/AuthAction";
import { useDispatch, useSelector } from "react-redux";
import AlertNotification from "../../UI/AlertNotification/AlertNotification";
import { useNavigate } from "react-router";
import { getUserLocalStorage } from "../../utils/utils";
import SubmitBtn from "../../UI/Buttons/SubmitBtn/SubmitBtn"; // Import SubmitBtn

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Manage loading state
  const { user } = useSelector((state) => state.auth);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();

  const togglePasswordView = () => {
    setPasswordInputType((view) => {
      return view === "password" ? "text" : "password";
    });
  };

  const loginFormHandler = (data) => {
    setLoading(true); // Set loading to true when form is submitted
    dispatch(checkLogin({ ...data, callback: handleLogin }));
  };

  const toggleFormMode = () => {
    setIsForgotPassword((state) => !state);
  };

  useEffect(() => {
    const token = getUserLocalStorage();
    if (token) {
      navigate("/user");
    }
  }, []);

  const handleLogin = (data) => {
    setLoading(false); // Set loading to false after login is complete
    if (data?.twoFactorEnabled === true) {
      navigate("/user");
    } else {
      navigate("/user");
    }
    window.location.reload(); 
  };

  useEffect(() => {
    if (user.error) {
      setLoading(false); // Set loading to false after login is complete
      setAlertMessage(user.message || "Login failed. Please try again.");
      setShowAlert(true);
    }
  }, [user]);

  const options = [{ id: 1, label: "Remember Me", value: false }];
  const [rembermeOption, setRembermeOption] = useState([]);
  
  return (
    <>
      {/* Show the alert only if there's a message */}
    {alertMessage && (
      <AlertNotification
        show={showAlert}
        message={alertMessage}
        type="error"
        onClose={() => setShowAlert(false)}
      />
    )}

      {!isForgotPassword && (
        <>
          <section className="login__page">
            <div className="login__page__container">
              <div className="login__logo-container flex gap-3 items-center content-center py-3 justify-center">
                <img src={generalContent.logo} alt={generalContent.title} />
                <h1 className="text-xl font-medium"> {generalContent.title} </h1>
              </div>
              <div className="login__container">
                <h6 className="text--xl py-3 text-center">Sign In</h6>
                <form onSubmit={handleSubmit(loginFormHandler)}>
                  <FormInput
                    id="username"
                    label="User Name"
                    placeholder="Enter your Email / Mobilno"
                    errors={errors}
                    register={register}
                    validation={{ required: "User Name is required" }}
                  />
                  <PasswordInput
                    id="password"
                    type={passwordInputType}
                    label="Password"
                    placeholder="Enter your Password"
                    register={register}
                    errors={errors}
                    validation={{ required: "Password is required" }}
                    onChange={togglePasswordView}
                  />
                  <div className="text-end my-3 flex justify-between">
                    <div className="remberme__container flex align-center">
                      <CheckBoxInput
                        options={options}
                        onChange={setRembermeOption}
                        selectedValues={rembermeOption}
                      />
                    </div>
                    <button
                      onClick={toggleFormMode}
                      className="text-sm text-[#269bdd] hover:text-[#269bdd] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <div className="flex justify-center items-center">
                    <SubmitBtn
                      label="Sign In"
                      type="submit"
                      loading={loading} // Pass the loading state
                      className="w-full py-3 font-medium shadow-lg"
                    />
                  </div>
                </form>
              </div>
            </div>
          </section>
        </>
      )}

      {isForgotPassword && <ForgotPassword toggleFormMode={toggleFormMode} />}
    </>
  );
}
