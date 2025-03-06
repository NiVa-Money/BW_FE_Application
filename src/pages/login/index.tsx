/* eslint-disable no-unsafe-optional-chaining */
import { useState } from "react";
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
        console.error("Error logging in with Google:", err);
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

  return (
    <>
      <head>
        <title>BotWot iCX - Login</title>
      </head>
      <div className="overflow-hidden py-4 pr-4 pl-20 bg-white rounded-none max-md:pl-5">
        <div className="flex gap-5 max-md:flex-col">
          {/* Left Section */}
          <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col items-center self-stretch my-auto h-[758px] max-md:mt-10 max-md:max-w-full">
              {/* Header */}
              <div className="flex relative flex-col justify-center self-stretch w-full max-md:max-w-full">
                <div className="flex z-0 flex-col justify-center items-start w-full ">
                  <div className="flex gap-4 justify-center items-center">
                    <a href="https://botwot.io" className="cursor-pointer">
                      <img
                        loading="lazy"
                        src="/assets/logo.svg"
                        alt="BotWot Logo"
                        className="object-contain shrink-0 self-stretch my-auto w-[300px]"
                      />
                    </a>
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="mt-6 text-5xl font-bold text-neutral-800">
                  Welcome to
                  <br />
                  Future of iCX
                </div>

                {/* Google Login */}
                <div
                  className="flex items-center justify-center gap-2 mt-6 px-4 py-2 bg-neutral-800 text-white rounded-full cursor-pointer"
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
              <div className="mt-8 mb-0 text-base font-medium text-black">
                - OR -
              </div>

              {/* Login Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center max-w-full w-[600px]"
              >
                <div className="flex relative flex-col w-full text-base leading-snug text-black max-md:max-w-full">
                  {/* Input Fields */}
                  <div className="flex flex-col justify-center text-black self-center max-w-full w-[600px]">
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
                        className="flex gap-2.5 items-center px-8 py-4 mt-7 w-full bg-neutral-100 text-black rounded-[128px] max-md:px-5 max-md:max-w-full"
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
                          className="w-full bg-transparent outline-none relative"
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

                  {/* Login Button */}
                  <div className="flex flex-col items-center self-center mt-16 w-full max-w-[600px] min-h-[323px] max-md:mt-10 max-md:max-w-full">
                    <button
                      type="submit"
                      className="gap-2.5 self-stretch px-2.5 py-4 w-full text-xl text-white rounded-full bg-neutral-800 min-h-[63px]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Log in"}
                    </button>
                    <div className="gap-1 mt-8 text-base text-neutral-400">
                      <span className="leading-6 text-black">
                        Don't have an account?{" "}
                      </span>
                      <Link to="/Signup">Sign Up</Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}

          <div className="flex flex-col ml-5 w-[55%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src="/assets/login.gif"
              width={500}
              height={300}
              alt="Animated GIF"
              className="w-full rounded-none max-md:mt-10 max-md:max-w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
