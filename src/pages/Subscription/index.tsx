/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [plansData, setPlansData] = useState([]);
  useEffect(() => {
    console.log("Subscription page mounted");
    dispatch(getSubscriptionAction());
  }, []);
  useEffect(() => {
    if (plansDataRedux) {
      setPlansData(plansDataRedux);
    }
  }, [plansDataRedux]);

  return (
    <div className="flex flex-col min-h-screen p-6">
      {/* Header Section */}
      <div className="px-6 pt-4">
        <h2 className="text-3xl font-bold mb-1 text-gray-900">
          Flexible Pricing for everyone
        </h2>
        <p className="text-gray-600 text-base mb-6">
          Unlock Your Creative Potential with Our Tailored Plans
        </p>
      </div>
      <div className="flex px-6 mt-4 justify-start gap-10 items-center">
        {plansData.map((plan: any, index: any) => (
          <SubscriptionCard key={index} planInfo={plan} />
        ))}
      </div>
    </div>
  );
};

export default Subscription;
