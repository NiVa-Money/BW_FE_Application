// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import { getWhatsappRequest } from "../../../store/actions/integrationActions";
// import { RootState } from "../../../store";
// import { useNavigate } from "react-router-dom";

// interface Integration {
//   id: string;
//   botId: string;
//   botName: string;
//   userId: string;
//   appId: string;
//   phoneNumberId: string;
//   phoneNumber: string;
//   whatsappBusinessAccountId: string;
//   whatsappName: string;
//   accessToken: string;
//   verificationStatus: boolean;
//   webhookUrl: string;
//   secretToken: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function WhatsappIntegrationList() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const crudIntegrationData = useSelector(
//     (state: RootState) => state?.crudIntegration?.crudIntegration?.data
//   );

//   useEffect(() => {
//     dispatch(getWhatsappRequest(""));
//   }, []);

//   const integrationArray = crudIntegrationData
//     ? Array.isArray(crudIntegrationData)
//       ? crudIntegrationData
//       : [crudIntegrationData]
//     : [];

//   return (
//     <div className="p-6 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Active Integrations
//           </h2>
//           <button
//             className="bg-[#005C4B] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#005C4B]/90 transition-colors flex items-center gap-2"
//             onClick={() => navigate("/createintegration")}
//           >
//             <AddIcon /> Add Integration
//           </button>
//         </div>

//         {integrationArray.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {integrationArray.map((integration: Integration) => (
//               <div
//                 key={integration.id}
//                  className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full max-w-[400px] mx-auto"
//               >
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   {integration.whatsappName}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Bot Name:{" "}
//                   <span className="font-medium">{integration.botName}</span>
//                 </p>

//                 <div className="mt-4 space-y-2 whitespace-nowrap">
//                   <p>
//                     <span className="font-medium text-gray-700 whitespace-nowrap">
//                       App ID:
//                     </span>{" "}
//                     {integration.appId}
//                   </p>
//                   <p>
//                     <span className="font-medium text-gray-700">
//                       Phone Number:
//                     </span>{" "}
//                     {integration.phoneNumber}
//                   </p>
//                   <p>
//                     <span className="font-medium text-gray-700">
//                       Business Account ID:
//                     </span>{" "}
//                     {integration.whatsappBusinessAccountId}
//                   </p>
//                   <p>
//                     <span className="font-medium text-gray-700 whitespace-nowrap">
//                       Access Token:
//                     </span>{" "}
//                     <span
//                       className="truncate block w-64"
//                       title={integration.accessToken}
//                     >
//                       {integration.accessToken}
//                     </span>
//                   </p>
//                   <p>
//                     <span className="font-medium text-gray-700">
//                       Secret Token :
//                     </span>{" "}
//                     <span
//                       className="truncate block w-70 mb-2"
//                       title={integration.secretToken}
//                     >
//                       {integration.secretToken}
//                     </span>
//                     <span className="font-medium text-gray-700">
//                       Webhook URL:
//                     </span>{" "}
//                     <span
//                       className="truncate block w-70"
//                       title={integration.webhookUrl}
//                     >
//                       {integration.webhookUrl}
//                     </span>
//                   </p>
//                   <p>
//                     <span className="font-medium text-gray-700">
//                       Verification Status:
//                     </span>{" "}
//                     {integration.verificationStatus
//                       ? "✅ Verified"
//                       : "❌ Not Verified"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Created At: {integration.createdAt}
//                   </p>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                   <button
//                     // onClick={() => navigate(`/editintegration/${integration.botId}`)}
//                     onClick={() => navigate(`/editintegration`)}
//                     className="text-gray-100 bg-[#005C4B] rounded-3xl px-4 py-2 flex items-center gap-2 hover:bg-blue-700 transition-colors"
//                   >
//                     <EditIcon /> Edit
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center">No integrations found.</p>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { getWhatsappRequest } from "../../../store/actions/integrationActions";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";

interface Integration {
  id: string;
  botId: string;
  botName: string;
  userId: string;
  appId: string;
  phoneNumberId: string;
  phoneNumber: string;
  whatsappBusinessAccountId: string;
  whatsappName: string;
  accessToken: string;
  verificationStatus: boolean;
  webhookUrl: string;
  secretToken: string;
  createdAt: string;
  updatedAt: string;
  countryCode: string;
}

export default function WhatsappIntegrationList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const crudIntegrationData = useSelector(
    (state: RootState) => state?.crudIntegration?.crudIntegration?.data
  );

  useEffect(() => {
    dispatch(getWhatsappRequest(""));
  }, [dispatch]);

  const integrationArray = crudIntegrationData
    ? Array.isArray(crudIntegrationData)
      ? crudIntegrationData
      : [crudIntegrationData]
    : [];

  const handleEdit = (integration: Integration) => {
    navigate(`/editintegration`, { state: { integration } });
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Active Whatsapp Integrations
          </h2>
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
            onClick={() => navigate("/createintegration")}
          >
            <AddIcon /> Add Integration
          </button>
        </div>

        {integrationArray.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrationArray.map((integration: Integration) => (
              <div
                key={integration.id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full max-w-[400px] mx-auto"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {integration.whatsappName}
                </h3>
                <p className="text-sm text-gray-500">
                  Bot Name:{" "}
                  <span className="font-medium">{integration.botName}</span>
                </p>

                <div className="mt-4 space-y-2 whitespace-nowrap">
                  <p>
                    <span className="font-medium text-gray-700 whitespace-nowrap">
                      App ID:
                    </span>{" "}
                    {integration.appId}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Phone Number:
                    </span>{" "}
                    {integration.phoneNumber}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Business Account ID:
                    </span>{" "}
                    {integration.whatsappBusinessAccountId}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700 whitespace-nowrap">
                      Access Token:
                    </span>{" "}
                    <span
                      className="truncate block w-64"
                      title={integration.accessToken}
                    >
                      {integration.accessToken}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Secret Token :
                    </span>{" "}
                    <span
                      className="truncate block w-70 mb-2"
                      title={integration.secretToken}
                    >
                      {integration.secretToken}
                    </span>
                    <span className="font-medium text-gray-700">
                      Webhook URL:
                    </span>{" "}
                    <span
                      className="truncate block w-70"
                      title={integration.webhookUrl}
                    >
                      {integration.webhookUrl}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Verification Status:
                    </span>{" "}
                    {integration.verificationStatus
                      ? "✅ Verified"
                      : "❌ Not Verified"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created At: {integration.createdAt}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleEdit(integration)}
                    className="text-gray-100 bg-[#65558F] rounded-3xl px-4 py-2 flex items-center gap-2 hover:bg-[#65558F]/90 transition-colors"
                  >
                    <EditIcon /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No integrations found.</p>
        )}
      </div>
    </div>
  );
}