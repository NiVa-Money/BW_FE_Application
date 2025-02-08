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
//   userId: string;
//   appId: string;
//   phoneNumberId: string;
//   phoneNumber: string;
//   whatsappBusinessAccountId: string;
//   whatsappName: string;
//   accessToken: string;
//   verificationStatus: boolean;
//   webhookUrl: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function IntegrationList() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const crudIntegrationData = useSelector(
//     (state: RootState) => state?.crudIntegration?.crudIntegration?.data
//   );

//   useEffect(() => {
//     dispatch(getWhatsappRequest(""));
//   }, [dispatch]);

//   const integrationArray = crudIntegrationData
//     ? Array.isArray(crudIntegrationData)
//       ? crudIntegrationData
//       : [crudIntegrationData]
//     : [];

//   return (
//     <div className="p-8 mt-10 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Active Integrations
//           </h2>
//           <button
//             className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
//             onClick={() => navigate("/createintegration")}
//           >
//             <AddIcon /> Add Integration
//           </button>
//         </div>

//         {integrationArray.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse border border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2">App ID</th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Phone Number ID
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Business Account ID
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Phone Number
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     WhatsApp Name
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Access Token
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Webhook URL
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Verification Status
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Created At
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {integrationArray.map((integration: Integration) => (
//                   <tr key={integration.id} className="border border-gray-300">
//                     <td className="border border-gray-300 px-4 py-2">
//                       {integration.appId}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {integration.phoneNumberId}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {integration.whatsappBusinessAccountId}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {integration.phoneNumber}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {integration.whatsappName}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2 max-w-[200px] truncate">
//                       <span title={integration.accessToken}>
//                         {integration.accessToken.substring(0, 15)}...
//                       </span>
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2 max-w-[200px] truncate">
//                       <span title={integration.webhookUrl}>
//                         {integration.webhookUrl.substring(0, 30)}...
//                       </span>
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {integration.verificationStatus
//                         ? "✅ Verified"
//                         : "❌ Not Verified"}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {integration.createdAt}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2 text-center">
//                       <button
//                         onClick={() =>
//                           navigate(`/editintegration/${integration.id}`)
//                         }
//                         className="text-green-500 hover:text-green-700 flex items-center gap-2"
//                       >
//                         <EditIcon /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500">No integrations found.</p>
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
  botName : string;
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
}

export default function IntegrationList() {
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

  return (
    <div className="p-8 mt-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Active Integrations</h2>
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
              <div key={integration.id} className="bg-white shadow-md w-[500px] rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">{integration.whatsappName}</h3>
                <p className="text-sm text-gray-500">Bot Name: <span className="font-medium">{integration.botName
                }</span></p>
                
                <div className="mt-4 space-y-2 whitespace-nowrap">  
                  <p><span className="font-medium text-gray-700 whitespace-nowrap">App ID:</span> {integration.appId}</p>
                  <p><span className="font-medium text-gray-700">Phone Number:</span> {integration.phoneNumber}</p>
                  <p><span className="font-medium text-gray-700">Business Account ID:</span> {integration.whatsappBusinessAccountId}</p>
                  <p>
                    <span className="font-medium text-gray-700 whitespace-nowrap">Access Token:</span>{" "}
                    <span className="truncate block w-64" title={integration.accessToken}>
                      {integration.accessToken}
                    </span>
                  </p>
                  <p>
                  <span className="font-medium text-gray-700">Secret Token :</span>{" "}
                    <span className="truncate block w-70 mb-2" title={integration.secretToken}>
                      {integration.secretToken}
                    </span>
                    <span className="font-medium text-gray-700">Webhook URL:</span>{" "}
                    <span className="truncate block w-70" title={integration.webhookUrl}>
                      {integration.webhookUrl}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Verification Status:</span>{" "}
                    {integration.verificationStatus ? "✅ Verified" : "❌ Not Verified"}
                  </p>
                  <p className="text-sm text-gray-500">Created At: {integration.createdAt}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    // onClick={() => navigate(`/editintegration/${integration.botId}`)}
                    onClick={() => navigate(`/editintegration`)}
                    className="text-gray-100 bg-[#65558F] rounded-3xl px-4 py-2 flex items-center gap-2 hover:bg-blue-700 transition-colors"
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
