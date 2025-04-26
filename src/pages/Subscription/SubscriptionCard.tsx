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
        <div className="flex justify-center shadow-md p-6 rounded-2xl items-start min-h-[640px] min-w-[272px] bg-gray-100 hover:bg-[#eadeff] transition-colors duration-200">
            <div className="w-64 flex flex-col items-start">
                <div className="flex flex-col justify-between w-full items-center h-full">
                    <p className="text-gray-500 text-sm font-medium text-[20px]">
                        {planInfo.name.charAt(0).toUpperCase() + planInfo.name.slice(1).toLowerCase()} Plan
                    </p>                    <h2 className="text-4xl font-bold mt-6 mb-6">{planInfo.price ? `$ ${planInfo.price}/month` : 'Custom'}</h2>
                </div>
                <div className="flex items-center">

                    <p className="ml-2 text-gray-600 text-sm"> {planInfo.description}</p>
                </div>
                <div className="w-full space-y-4 mb-10 mt-[1rem]">
                    {planInfo.meta?.sessionLimit &&
                        <div className="flex items-center">
                            <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="ml-2 text-gray-600 text-sm">{planInfo.meta?.sessionLimit} AI credits / month.</p>
                        </div>}

                    {planInfo.meta?.userLimit &&
                        <div className="flex items-center">
                            <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="ml-2 text-gray-600 text-sm">{planInfo.meta?.userLimit} users included.</p>
                        </div>}
                    {planInfo.meta?.setupFee &&
                        <div className="flex items-center">
                            <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="ml-2 text-gray-600 text-sm">${planInfo.meta?.setupFee} setup fee (one-time)</p>
                        </div>}

                    {planInfo.meta?.extraCreditsPrice && planInfo.meta?.sessionLimit &&
                        <div className="flex items-center">
                            <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="ml-2 text-gray-600 text-sm">${planInfo.meta?.extraCreditsPrice} per {planInfo.meta?.sessionLimit} additional credits</p>
                        </div>}

                    {planInfo.meta?.extraUserPrice && planInfo.meta?.extraCreditsPerUser &&
                        <div className="flex items-center">
                            <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="ml-2 text-gray-600 text-sm">${planInfo.meta?.extraUserPrice} / user + {planInfo.meta?.extraCreditsPerUser} AI credits / user</p>
                        </div>}
                    {planInfo.meta?.features.map((item) =>

                        <div className="flex items-center">
                            <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="ml-2 text-gray-600 text-sm">{item}</p>
                        </div>)}



                </div>

                <button
                    className={`w-full ${planInfo.name === 'enterprise' ? 'mt-[12.5rem]' : 'mt-[5.5rem]'}  py-3 px-4 bg-[#65568e] hover:bg-white text-white hover:text-[#2E2F5F] font-medium rounded-full transition-all duration-200 relative group shadow-md hover:shadow-lg`}
                    onClick={() => createSubscriptionOrder()}
                >
                    <span className="relative z-10">
                        {planInfo.name === 'pro' ? 'Get Pro' : planInfo.name === 'base' ? 'Get Started' : 'Contact Sales'}
                    </span>

                    {/* Gradient outline effect */}
                    <span
                        className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'linear-gradient(to right, #6640FF, #A5FFD6, #78C9F1)',
                            zIndex: 0,
                            filter: 'blur(1px)'
                        }}
                    ></span>

                    {/* Inner container to hide gradient bleed */}
                    <span
                        className="absolute -inset-[1px] rounded-full bg-[#65568e] group-hover:bg-white transition-colors duration-200"
                        style={{ zIndex: 1 }}
                    ></span>
                </button>
            </div>
        </div>
    );
};

export default SubscriptionCard;
