import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants";

const SubscriptionFailure: React.FC = () => {
  const navigate = useNavigate();

  const dashboardHandler = () => {
    navigate("/dashboard");
  };

  return (
    <div className="overflow-hidden py-4 pr-20 pl-4 bg-white rounded-none max-md:pr-5 h-screen w-screen flex justify-center items-center">
      <div className="flex justify-center flex-col items-center">
        <ErrorIcon style={{ color: COLORS.DARKGRAY, fontSize: "40px" }} />
        <h2 className="text-3xl font-bold text-gray-900 ml-4">
          Subscription Failed!
        </h2>
        <p className="text-gray-600 text-base mb-6 ml-4 text-center">
          Looks like something went wrong.
          Give it another shot and get ready
          to unlock all the good stuff!
        </p>
        <div className="flex gap-4 justify-center align-center">
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
            onClick={dashboardHandler}
          >
            Go to Dashboard
          </button>
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
            onClick={() => {}}
          >
            Retry Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFailure;
