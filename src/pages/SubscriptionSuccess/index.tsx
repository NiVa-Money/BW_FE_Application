import React from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { COLORS } from "../../constants";
import { useNavigate } from "react-router-dom";


const SubscriptionSuccess: React.FC = () => {
    const navigate = useNavigate();
    const dahboardHandler = () => {
        navigate("/dashboard");
    };
    return (
        <div className="overflow-hidden py-4 pr-20 pl-4 bg-white rounded-none max-md:pr-5 h-screen w-screen flex justify-center items-center">
            <div className="flex justify-center flex-col items-center">
                <CheckCircleIcon style={{ color: COLORS.VIOLET, fontSize: '40px' }} />
                <h2 className="text-3xl font-bold text-gray-900 ml-4">
                    Subscription Successful!
                </h2>
                <p className="text-gray-600 text-base mb-6 ml-4">
                    You’re all set to explore!
                    Kick things off by creating your first agent to automate and supercharge your workflow.                </p>

                <button
                    className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium 
                       hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
                    onClick={dahboardHandler}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SubscriptionSuccess;
