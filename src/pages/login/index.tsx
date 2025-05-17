/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfileService,
  LoginUserService,
  LoginverifyGoogleLogin,
  verifyGoogleUserService,
} from "../../api/services/authServices";
import { Link } from "react-router-dom";
import { loginWithGoogle } from "../../components/firebase/firebaseConfig";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [EUAChecked, setEUAChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email and password
  const isValidEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidForm = () => email && password && isValidEmail(email);

  // Handle form login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidForm()) {
      setError("Please provide a valid email and password.");
      return;
    } else {
      try {
        const response = await LoginUserService({ email, password });
        if (response.success) {
          localStorage.setItem("user_id", response.user_id);
          localStorage.setItem("orgId", response.orgId);
          localStorage.setItem("token", response.token);
          localStorage.setItem(
            "userData",
            JSON.stringify({ moduleMap: response.moduleMap })
          );
          setEmail("");
          setPassword("");
          navigate("/dashboard");
          navigate(0);
        } else {
          setError(
            response.message || "Google login failed. Please try again."
          );
        }
      } catch (err) {
        console.error("Error logging in:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await loginWithGoogle();
      if (response.success) {
        try {
          const emailverify = await verifyGoogleUserService({
            emailId: response?.user?.email,
          });
          if (emailverify.success) {
            localStorage.setItem("user_id", emailverify.user_id);
            localStorage.setItem("token", emailverify.token);
            try {
              const email: string = response?.user?.email
                ? encodeURIComponent(response.user.email)
                : "";
              const userProfile = await getUserProfileService(email);
              if (userProfile) {
                localStorage.setItem("userData", JSON.stringify(userProfile));
              }
              navigate("/dashboard");
              navigate(0);
            } catch {
              console.error("Error fetching user detail");
            }
          } else {
            setError(
              response.message || "Google login failed. Please try again."
            );
          }
        } catch (err) {
          if (err) {
            try {
              const [firstName, ...rest] =
                response?.user.displayName.split(" ");
              const lastName = rest.join("");

              const payload = {
                firstName,
                lastName,
                emailId: response?.user?.email,
                mobileNo: "",
              };

              const signUpGoogle = await LoginverifyGoogleLogin(payload);

              if (signUpGoogle?.data?.success) {
                try {
                  const emailverify = await verifyGoogleUserService({
                    emailId: payload?.emailId,
                  });
                  if (emailverify.success) {
                    localStorage.setItem("user_id", emailverify.user_id);
                    localStorage.setItem("token", emailverify.token);
                    try {
                      const email: string = response?.user?.email
                        ? encodeURIComponent(response.user.email)
                        : "";
                      const userProfile = await getUserProfileService(email);
                      if (userProfile) {
                        localStorage.setItem(
                          "userData",
                          JSON.stringify(userProfile)
                        );
                      }
                      navigate("/dashboard");
                      navigate(0);
                    } catch {
                      console.error("Error fetching user detail");
                    }
                  } else {
                    setError(
                      response.message ||
                        "Google login failed. Please try again."
                    );
                  }
                } catch (error) {
                  console.log("Error while Verify", error);
                }
              }
            } catch (error) {
              console.log("Error:", error);
            }
          }

          console.error("Error logging in with Google:", err);
          setError("An unexpected error occurred during Google login.");
        }
      } else {
        setError(response.message || "Google login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error logging in with Google:", err);
      setError("An unexpected error occurred during Google login.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "BotWot iCX - Login";
  }, []);
  console.log("EUAChecked", EUAChecked, "isLoading", isLoading);
  return (
    <>
      <div className="overflow-hidden  bg-white rounded-none">
        <div className="flex gap-5 max-md:flex-col h-[100vh]">
          {/* Left Section */}
          <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col items-center self-stretch my-auto h-[100%] max-md:mt-10 max-md:max-w-full ">
              {/* Header */}
              <div className="flex relative flex-col justify-center self-stretch w-full max-md:max-w-full">
                <div className="flex z-0 flex-col justify-center items-start w-full mt-[2rem]">
                  <div className="flex gap-4 justify-center items-center">
                    <a href="https://botwot.io" className="cursor-pointer">
                      <img
                        loading="lazy"
                        src="/assets/botwotLogo.svg"
                        alt="BotWot Logo"
                        className="object-contain shrink-0 self-stretch my-auto w-[250px]"
                      />
                    </a>
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="mt-6 text-4xl font-bold text-neutral-800 items-center text-center">
                  Welcome to
                  <br />
                  Future of iCX
                </div>

                {/* Google Login */}
                <div
                  className="flex items-center justify-center gap-2 mt-6 p-3 bg-gray-200 hover:bg-gray-300 text-black rounded-full cursor-pointer w-96 mx-auto shadow-lg"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src="/assets/google_logo.svg"
                    alt="Google Login"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  Login with Google
                </div>
              </div>

              {/* Divider */}
              <div className="mt-5 text-base font-medium text-black">
                - OR -
              </div>

              {/* Login Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center max-w-full w-[600px]"
              >
                <div className="flex flex-col justify-center text-black self-center max-w-full w-96 mx-auto ">
                  {/* Input Fields */}
                  <div className="flex flex-col gap-2 justify-center text-black self-center max-w-full w-[600px]">
                    {[
                      {
                        placeholder: "Enter your email",
                        imgSrc: "/assets/mail_icon.svg",
                        value: email,
                        onChange: setEmail,
                      },
                      {
                        placeholder: "Enter your password",
                        imgSrc: "/assets/key_icon.svg",
                        value: password,
                        onChange: setPassword,
                        type: showPassword ? "text" : "password",
                        isPassword: true,
                      },
                    ].map((field, index) => (
                      <div
                        key={index}
                        className="relative flex gap-2.5 items-center px-6 py-2 mt-4 w-full bg-neutral-100 text-black rounded-[128px] max-md:px-5 max-md:max-w-full"
                      >
                        <img
                          loading="lazy"
                          src={field.imgSrc}
                          alt="Input Icon"
                          width={20}
                          height={20}
                          className="object-contain shrink-0 self-stretch my-auto w-6"
                        />
                        <input
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full bg-transparent outline-none border-0 relative focus:outline-none focus:ring-0"
                        />
                        {field.isPassword && (
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className=" text-gray-500 hover:text-gray-700 absolute flex justify-start right-[38px]"
                          >
                            {showPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                  <div className="mb-6 mt-8">
                    <div className="flex items-start gap-2 px-6 py-4 bg-[#fef7ff]">
                      <input
                        type="checkbox"
                        className="h-5 w-5 min-w-[20px] text-[#65558F] border-2 border-gray-300 rounded mt-1"
                        checked={EUAChecked}
                        onChange={() => setEUAChecked(!EUAChecked)}
                      />
                      <span className="font-medium  text-[#49454F] text-sm">
                        By creating an account, you agree to Botwot iCX's Terms
                        and&nbsp;
                        <a
                          href="https://botwot.io/resources/policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#65558F] underline"
                        >
                          Privacy Policy
                        </a>
                        , and consent to receive occasional promotional emails.
                        You can unsubscribe anytime.
                      </span>
                    </div>
                  </div>

                  {/* Login Button */}
                  <div className="flex flex-col items-center self-center w-full max-w-[600px]  max-md:mt-10 max-md:max-w-full mb-4">
                    <button
                      type="submit"
                      className="px-2.5 py-2 mt-2 w-full text-xl text-white rounded-full bg-black min-h-[55px] disabled:opacity-50 hover:bg-neutral-700 transition-colors"
                      disabled={isLoading || !EUAChecked}
                    >
                      {isLoading ? "Logging in..." : "Log in"}
                    </button>
                    <div className="gap-1 mt-8 text-base text-neutral-400">
                      <span className="leading-6 text-black">
                        Don't have an account?{" "}
                      </span>
                      <Link to="/Signup" style={{ color: "#65558F" }}>
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}

          <div className="flex flex-col w-[50%] h-[100%] tems-center justify-center max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src="/assets/login.gif"
              alt="Animated GIF"
              className="object-contain max-w-[100%] max-h-[95%] rounded-3xl mx-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
