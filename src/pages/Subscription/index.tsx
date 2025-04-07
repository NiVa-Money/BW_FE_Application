import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscriptionAction } from "../../store/actions/subscriptionActions";
import { RootState } from "../../store";
import SubscriptionCard from "./SubscriptionCard";

const Subscription: React.FC = (): React.ReactElement => {
    const dispatch = useDispatch();
    const plansDataRedux = useSelector(
        (state: RootState) => state.subscription?.plans?.data
    );
    const [plansData, setPlansData] = useState([])
    useEffect(() => {
        console.log("Subscription page mounted");
        dispatch(getSubscriptionAction())
    }, [])
    useEffect(() => {
        if (plansDataRedux) {
            setPlansData(plansDataRedux)
        }
    }, [plansDataRedux])

    return (
        <div className="flex flex-col min-h-screen p-6">
            {/* Header Section */}
            <div className="px-6 pt-4 flex-none">
                <h1 className="text-xl font-semibold">Flexible Pricing for Everyone</h1>
                <p className="text-gray-600 text-sm">Unlock Your Creative Potential with Our Tailored Plans</p>
            </div>
            <div className="flex px-6 mt-4 justify-start gap-10 items-center">
                {plansData.map((plan: any, index: any) => <SubscriptionCard key={index} planInfo={plan} />)}


            </div>

        </div>
    );
};

export default Subscription;
