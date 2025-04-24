import React, { useEffect } from "react";
import { createPaymentRequestAction, resetCreateSubscriptionAction } from "../../store/actions/subscriptionActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { COLORS } from "../../constants";


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
        <div className="flex justify-center shadow-md p-6 rounded-2xl items-center min-h-[640px] min-w-[272px] bg-gray-100" style={{ backgroundColor: `${planInfo.name === 'pro' ? '#eadeff' : ''}` }}>
            <div className="w-64 flex flex-col items-center">
                <div className="text-center mb-6 mt-[2.5rem]">
                    <p className="text-gray-500 text-sm font-medium">{planInfo.description}</p>
                    <h2 className="text-4xl font-bold mt-1">{planInfo.price ? `$ ${planInfo.price}/month` : 'Custom'}</h2>
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

                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="ml-2 text-gray-600 text-sm">{item}</p>
                        </div>)}


                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="ml-2 text-gray-600 text-sm">Text uploads allowed for content.</p>
                    </div>
                </div>

                <button className="w-full mt-[5.5rem] py-3 px-4 bg-[#65568e] text-white font-medium rounded-full transition duration-200" style={{ backgroundColor: `${planInfo.name === 'pro' ? '#ffff' : ''}`, color: `${planInfo.name === 'pro' ? COLORS.DARKVIOLET : ''}` }} onClick={() => createSubscriptionOrder()}>
                    {planInfo.name === 'pro' ? 'Get Pro' : planInfo.name === 'basic' ? 'Get Started' : 'Contact Sales'}
                </button>
            </div>
        </div>
    );
};

export default SubscriptionCard;
