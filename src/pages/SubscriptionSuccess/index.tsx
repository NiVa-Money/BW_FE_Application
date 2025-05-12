import React, { useEffect } from "react";
import { COLORS } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { capturePaymentService } from "../../api/services/subscriptionServices";


const SubscriptionSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const subscriptionId = queryParams.get('subscription_id');
    console.log("Subscription ID:", subscriptionId);

    const dahboardHandler = () => {
        navigate("/dashboard");
    };
    useEffect(() => {
        const capturePayment = async () => {
            if (subscriptionId) {
                try {
                    const result = await capturePaymentService(subscriptionId);
                    console.log('Payment captured:', result);
                    // You can show a success message here if needed
                } catch (error) {
                    console.error(error);
                    // You can show an error message here if needed
                }
            }
        };

        capturePayment();
    }, [subscriptionId]);
    return (
        <div className="overflow-hidden py-4 pr-20 pl-4 bg-white rounded-none max-md:pr-5 h-screen w-screen flex justify-center items-start">
            <div className="flex justify-center flex-col w-[100%] items-start">
                <div className="w-[100%] h-[350px] bg-[#F7F7FC]">
                    <div className="w-full h-full flex justify-center items-center">
                        <img
                            width={'100%'}
                            height={'250px'}
                            src='/assets/subscription_success.gif'
                            alt={'Subscription_Success'}
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
                <h2 className={`text-2xl font-bold text-[${COLORS.success}] mt-4 self-center`}>
                    Subscription Successful
                </h2>
                <p className="text-gray-600 font-[550] text-base self-center mt-2">
                    You’re all set to explore!
                </p>

                <p className="text-gray-400 text-base self-center">
                    Kick things off by creating your first agent to automate and supercharge your workflow.
                </p>


                <button
                    className="bg-[#65558F] self-center mt-6 text-white px-6 py-3 rounded-full font-medium border border-transparent hover:bg-transparent hover:text-[#65558F] hover:border-black transition-colors flex items-center gap-2"
                    onClick={dahboardHandler}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SubscriptionSuccess;
