import React, { useRef, useState } from "react";
import FormInput from "../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import Button from "../../UI/Buttons/Button/Button";
import icons from "../../contents/Icons";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import "./ForgotPassword.css";
import { forgotPasswordInProgress } from "../../redux/auth/AuthAction";
import AlertNotification from "../../UI/AlertNotification/AlertNotification";
import generalContent from "../../contents/GeneralContent";
import SubmitBtn from "../../UI/Buttons/SubmitBtn/SubmitBtn";
import CountdownTimer from "../../UI/OTP/CountdownTimer";
import { verifyforgotPwdChangeEffect, verifyforgotPwdOTPEffect } from "../../redux/auth/AuthEffect";
import { useLocation, useNavigate } from "react-router";

export default function ForgotPassword({ toggleFormMode }) {
  const dispatch = useDispatch();
  const location= useLocation()
  const { forgotPassword } = useSelector((state) => state.auth);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const {
    watch,
    register: passwordRegister,
    formState: { errors: passwordError },
    handleSubmit: passwordHandler,
  } = useForm();
  const [otpMode, setOtpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [otp, setOtp] = useState("");
  const [isResendEnabled, setIsResendEnabled] = useState(false); // New state
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [password,setPasswrod]= useState("");
  const [cfmPassword,setCfmPasswrod]= useState("");
  const timerRef = useRef();
  const [isSubmit,setIsSubmit] = useState(false)
  const triggerOtpCall = (data) => {
    setLoading(true);
    dispatch(
      forgotPasswordInProgress({
        ...data,
        callback: (response) => {
          setToastData({
            show: true,
            type: response?.error ? "error" : "success",
            message: response.message,
          });
          if (!response?.error) {
            setOtpMode(true);
            setIsResendEnabled(false); // Reset resend button state
          }
          setLoading(false);
          setTimeout(() => setToastData({ show: false }), 3000);
        },
      })
    );
    if (timerRef.current) timerRef.current.resetTimer(); // Reset the timer when OTP is resent
  };

  const forgotPwdFormHandler = (data) => {
    triggerOtpCall(data);
  };

  const otpFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyforgotPwdOTPEffect({
      username: forgotPassword?.data?.email,
      otp: otp,
    });
    setLoading(false);
    setOtpMode(false);
    setChangePasswordMode(true);
  };

  const handleTimerComplete = () => {
    setIsResendEnabled(true); // Enable Resend OTP when timer completes
  };

  const newPwdHandler = async(e) => {
    
    setIsSubmit(true);
    e.preventDefault();
    setLoading(true);
    await verifyforgotPwdChangeEffect({
      username: forgotPassword?.data?.email,
      password:password
    });
    setIsSubmit(false);
    setLoading(false);
    window.location.reload()

  };

  return (
    <>
      {toastData.show && (
        <AlertNotification
          message={toastData.message}
          onClose={() => setToastData({ show: false })}
          type={toastData.type}
        />
      )}
      <section className="login__page">
        <div className="login__page__container">
          <div className="login__logo-container flex gap-3 items-center content-center py-3 justify-center">
            <img src={generalContent.logo} alt={generalContent.title} />
            <h1 className="text-xl font-medium"> {generalContent.title} </h1>
          </div>
          <div className="login__container ">
            {changePasswordMode ? (
              <form onSubmit={newPwdHandler}>
               <div className="mb-3">
                <label>New Password</label>
                <input type="password" id="newPassword" className="border p-1 w-full rounded-sm	mt-2 border-secondary-400" value={password} onChange={(e)=>{setPasswrod(e.target.value)}}/>
                {isSubmit&&password.length<3&&<p className="text-red-500 text-sm">Provide Valid New Password</p>}
               </div>
               <div className="mb-3">
                <label>Confirm Password</label>
                <input type="password" id="confirmPassword" className="border p-1 w-full rounded-sm border-secondary-400	" value={cfmPassword} onChange={(e)=>{setCfmPasswrod(e.target.value)}}/>
                {((isSubmit&&password.length<3)|| (cfmPassword.length>0&&password !==cfmPassword))&&<p className="text-red-500 text-sm">Password Not Match</p>}

               </div>


                <SubmitBtn loading={loading} label="Submit" />
              </form>
            ) : otpMode ? (
              <form onSubmit={otpFormHandler}>
                <h6 className="text--xl py-3 text-center">Forgot Password</h6>
                <p className="mb-3 text-sm text-center text-secondary-300">
                  Enter the 4-digit OTP received on the phone number
                </p>
                <div className="otp__input justify-between">
                  <OtpInput
                    id="otp"
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    inputType="number"
                    renderInput={(props) => <input {...props} />}
                  />
                  <div className="flex justify-end my-1">
                    <button
                      className={`text-sm text-[#269bdd] hover:underline ${
                        !isResendEnabled ? "cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        if (isResendEnabled) {
                          triggerOtpCall({
                            username: forgotPassword.data.email,
                          });
                          setIsResendEnabled(false); // Disable after clicking
                        }
                      }}
                      disabled={!isResendEnabled} // Disable based on state
                    >
                      Resend OTP
                    </button>
                    (
                    <CountdownTimer
                      ref={timerRef}
                      isActive={!isResendEnabled}
                      onComplete={handleTimerComplete}
                      initialTime={10}
                    />
                    )
                  </div>
                  {otp.length === 4 && (
                    <div className="mt-3">
                      <SubmitBtn
                        label="Submit OTP"
                        loading={loading}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit(forgotPwdFormHandler)}>
                <h6 className="text--xl py-3 text-center">Forgot Password</h6>
                <FormInput
                  id="username"
                  label="User Name"
                  placeholder="Enter your Email / Mobile No"
                  errors={errors}
                  register={register}
                  validation={{ required: "User Name is required" }}
                />
                <div className="flex justify-end items-center mb-3">
                  <button
                    onClick={toggleFormMode}
                    className="text-sm text-[#269bdd] hover:underline flex gap-1 items-center"
                  >
                    {React.cloneElement(icons.leftLongLineArrowIcon, {
                      size: 22,
                    })}
                    Back to Login
                  </button>
                </div>
                <SubmitBtn
                  label="Reset Password"
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-lg transition-all"
                  loading={loading}
                />
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
