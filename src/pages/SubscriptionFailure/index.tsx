import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants";

const SubscriptionFailure: React.FC = () => {
  const navigate = useNavigate();

  const dashboardHandler = () => {
    navigate("/dashboard");
  };
  const subscriptionHandler = () => {
    navigate("/subscription");
  };

  return (
    <div className="overflow-hidden py-4 pr-20 pl-4 bg-white rounded-none max-md:pr-5 h-screen w-screen flex justify-center items-start">
      <div className="flex justify-center flex-col w-[100%] items-start">
        <div className="w-[100%] h-[350px] bg-[#F7F7FC]">
          <div className="w-full h-full flex justify-center items-center">
            <img
              width={'100%'}
              height={'200px'}
              src='/assets/subscription_failure.gif'
              alt={'Subscription_Failure'}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <h2 className={`text-2xl font-bold text-[${COLORS.ERROR}] mt-4 self-center`} style={{ color: COLORS.ERROR }}>
          Subscription Unsuccessful
        </h2>
        <p className="text-gray-600 font-[550] text-base self-center mt-2">
          You’re all set to explore!
        </p>

        <p className="text-gray-400 text-base self-center">
          Kick things off by creating your first agent to automate and supercharge your workflow.
        </p>

        <div className="flex gap-4 mt-6 self-center">
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium border border-transparent hover:bg-transparent hover:text-[#65558F] hover:border-black transition-colors flex items-center gap-2" onClick={dashboardHandler}
          >
            Go to Dashboard
          </button>
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium border border-transparent hover:bg-transparent hover:text-[#65558F] hover:border-black transition-colors flex items-center gap-2" onClick={subscriptionHandler}
          >
            Retry Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFailure;
