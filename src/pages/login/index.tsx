import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfileService, LoginUserService, verifyGoogleUserService } from "../../api/services/authServices";
import { Link } from "react-router-dom";
import { loginWithGoogle } from "../../components/firebase/firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    }

    setIsLoading(true);

    try {
      const response = await LoginUserService({ email, password });
      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await loginWithGoogle();
      if (response.success) {
        try {
          const emailverify = await verifyGoogleUserService({ emailId: response?.user?.email });
          if (emailverify.success) {
            localStorage.setItem('user_id', emailverify.user_id)
            try {
              const email: string = response?.user?.email
                ? encodeURIComponent(response.user.email)
                : '';
              const userProfile = await getUserProfileService(email)
              if (userProfile) {
                localStorage.setItem('userData', JSON.stringify(userProfile))
              }
              navigate("/dashboard");

            } catch {
              console.error("Error fetching user detail",);
            }
          } else {
            setError(response.message || "Google login failed. Please try again.");
          }
        } catch (err) {
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
        <title>BotWot ICX - Login</title>
      </head>
      <div className="overflow-hidden py-4 pr-4 pl-20 bg-white rounded-none max-md:pl-5">
        <div className="flex gap-5 max-md:flex-col">
          {/* Left Section */}
          <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col items-center self-stretch my-auto h-[758px] max-md:mt-10 max-md:max-w-full">
              {/* Header */}
              <div className="flex relative flex-col justify-center self-stretch w-full max-md:max-w-full">
                <div className="flex z-0 flex-col justify-center items-start w-full text-3xl font-semibold text-neutral-700 max-md:max-w-full">
                  <div className="flex gap-4 justify-center items-center">
                    <img
                      loading="lazy"
                      src="/assets/botwot_logo.svg"
                      width={50}
                      height={50}
                      alt="BotWot Logo"
                      className="object-contain shrink-0 self-stretch my-auto aspect-square w-[50px]"
                    />
                    <div className="self-stretch my-auto">BotWot ICX</div>
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="z-0 mt-6 text-5xl font-bold text-neutral-800">
                  Welcome to
                  <br />
                  Future of ICX
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
              <div className="mt-10 mb-0 text-base font-medium text-black">
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
                        type: "password",
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
                          className="w-full bg-transparent outline-none"
                        />
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
              src="/assets/login_banner.svg"
              width={500}
              height={500}
              alt="Main Banner"
              className="object-contain grow w-full rounded-none aspect-[0.78] max-md:mt-10 max-md:max-w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
