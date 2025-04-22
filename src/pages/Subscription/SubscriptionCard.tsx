import React, { useEffect } from "react";
import { createPaymentRequestAction, resetCreateSubscriptionAction } from "../../store/actions/subscriptionActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";


const SubscriptionCard: React.FC<any> = ({
    planInfo,
}) => {
    const dispatch = useDispatch();
    const createSubscriptionRedux = useSelector(
        (state: RootState) => state.subscription?.create?.data
    );
    const createSubscriptionOrder = () => {

        const paymentData: any = {
            planId: planInfo.paypalProductId,
            amount: planInfo.price,
            planName: planInfo.name,
        };
        dispatch(createPaymentRequestAction({ planId: paymentData.planId, data: paymentData }));
        console.log("SubscriptionCard", planInfo);
    }
    useEffect(() => {
        if (createSubscriptionRedux?.approvalUrl) {
            window.location.href = createSubscriptionRedux?.approvalUrl;
        }
    }, [createSubscriptionRedux?.approvalUrl]);

    useEffect(() => {
        return () => {
            // Reset the specific state when the component unmounts
            dispatch(resetCreateSubscriptionAction("create"));
        }
    }
        , []);

    console.log("createSubscriptionRedux", createSubscriptionRedux);
    return (
        <div className="flex justify-center shadow-md p-6 rounded-2xl items-center min-h-[640px] min-w-[272px] bg-gray-100">
            <div className="w-64 flex flex-col items-center">
                <div className="text-center mb-6 mt-[2.5rem]">
                    <p className="text-gray-500 text-sm font-medium">{planInfo.description}</p>
                    <h2 className="text-4xl font-bold mt-1">Free</h2>
                </div>

                <div className="w-full space-y-4 mb-10 mt-[1rem]">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="ml-2 text-gray-600 text-sm">Access to essential features for creating your AI chatbot.</p>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="ml-2 text-gray-600 text-sm">Suitable for up to 100 chat messages per month.</p>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="ml-2 text-gray-600 text-sm">Manage 1 Bot Profile with 1 Knowledge Base.</p>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="ml-2 text-gray-600 text-sm">Text uploads allowed for content.</p>
                    </div>
                </div>

                <button className="w-full mt-[5.5rem] py-3 px-4 bg-[#65568e] text-white font-medium rounded-full transition duration-200" onClick={() => createSubscriptionOrder()}>
                    Pay with Paypal
                </button>
            </div>
        </div>
    );
};

export default SubscriptionCard;
