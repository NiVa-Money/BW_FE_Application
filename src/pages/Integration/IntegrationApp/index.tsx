// import React from "react";

// const WhatsAppIntegration: React.FC = () => {
//   return (
//     <div className="min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Form Container */}
//         <div className=" rounded-2xl p-8">
//           {/* Title with WhatsApp Icon */}
//           <div className="flex items-center justify-between mb-6">
//             {/* Left Section: Icon and Title */}
//             <div className="flex items-center">
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                 alt="WhatsApp Icon"
//                 className="w-16 h-16 mr-3"
//               />
//               <h2 className="text-4xl font-semibold">WhatsApp Integration</h2>
//             </div>

//             {/* Right Section: Next Button */}
//             <button className="bg-[#65558F] w-[200px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#65558F]/85">
//               Done
//             </button>
//           </div>

//           <p className="text-gray-600 text-lg mb-8">
//             Please choose the bot you wish to implement for the WhatsApp
//             Integration.
//           </p>

//           {/* Form */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Left Column */}
//             <div>
//               {/* Provider Dropdown */}
//               <label className="block text-gray-700 font-medium mb-2">
//                 Choose your provider
//               </label>
//               <select className="w-full p-3 border border-gray-300 rounded-lg mb-4">
//                 <option value="Meta">Meta</option>
//               </select>

//               {/* WhatsApp Number */}
//               <label className="block text-gray-700 font-medium mb-2">
//                 WhatsApp number
//               </label>
//               <div className="flex items-center mb-4">
//                 <span className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-2">
//                   +91
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="Enter your WhatsApp number"
//                   className="flex-1 p-3 border border-gray-300 rounded-r-lg"
//                 />
//               </div>

//               {/* Mobile Number ID */}
//               <label className="block text-gray-700 font-medium mb-2">
//                 Mobile number ID
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your Meta Mobile number ID"
//                 className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//               />

//               <label className="block text-gray-700 font-medium mb-2">
//                 BotWot Webhook URL
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your BotWot Webhook URL "
//                 className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//               />
//             </div>

//             {/* Right Column */}
//             <div>
//               {/* Bot Dropdown */}
//               <label className="block text-gray-700 font-medium mb-2">
//                 Select bot
//               </label>
//               <select className="w-full p-3 border border-gray-300 rounded-lg mb-4">
//                 <option value="Bot 1">Bot 1</option>
//               </select>

//               {/* App ID */}
//               <label className="block text-gray-700 font-medium mb-2">
//                 App ID
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your Meta app ID"
//                 className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//               />

//               {/* Business Account ID */}
//               <label className="block text-gray-700 font-medium mb-2">
//                 Business account ID
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your Meta business account ID"
//                 className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//               />

//               <label className="block text-gray-700 font-medium mb-2">
//                 Secret Token
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your Secret Token "
//                 className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//               />
//             </div>
//           </div>

//           {/* Full-width Field */}
//           <label className="block text-gray-700 font-medium mb-2">
//             Permanent access token given by Meta
//           </label>
//           <input
//             type="text"
//             placeholder="Enter your token"
//             className="w-full p-3 border border-gray-300 rounded-lg mb-2"
//           />
//           <p className="text-sm text-gray-600 mb-6">
//             If you don't know where to access this token, you can{" "}
//             <a href="#" className="text-blue-500 hover:underline">
//               CLICK HERE
//             </a>{" "}
//             to find it.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WhatsAppIntegration;


import React, { useState } from "react";
import Modal from "./IntegrationModal";

const WhatsAppIntegration: React.FC = () => {
  const [formData, setFormData] = useState({
    botId: "bot-id",
    appId: "",
    phoneNumberId: "",
    whatsappBusinessAccountId: "",
    phoneNumber: "",
    accessToken: "",
  });

  const [modalData, setModalData] = useState({
    secretToken: '',
    webhookUrl: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const dispatch = useDispatch();

  const handleSubmit = () => {
    // Call the API to get the Secret Token and Webhook URL
    fetchApiData();
  };

  const fetchApiData = async () => {
    try {
      // Make the API call to get the data (replace with actual endpoint)
      const response = await fetch('/api/get-whatsapp-data');
      const data = await response.json();
      setModalData({
        secretToken: data.secretToken,
        webhookUrl: data.webhookUrl,
      });
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Form Container */}
        <div className="rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp Icon"
                className="w-16 h-16 mr-3"
              />
              <h2 className="text-4xl font-semibold">WhatsApp Integration</h2>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#65558F] w-[200px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#65558F]/85"
            >
              Done
            </button>
          </div>

          <p className="text-gray-600 text-lg mb-8">
            Please choose the bot you wish to implement for the WhatsApp
            Integration.
          </p>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Provider Dropdown */}
              <label className="block text-gray-700 font-medium mb-2">
                Choose your provider
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg mb-4">
                <option value="Meta">Meta</option>
              </select>

              {/* WhatsApp Number */}
              <label className="block text-gray-700 font-medium mb-2">
                WhatsApp number
              </label>
              <div className="flex items-center mb-4">
                <span className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-2">
                  +91
                </span>
                <input
                  type="text"
                  placeholder="Enter your WhatsApp number"
                  className="flex-1 p-3 border border-gray-300 rounded-r-lg"
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              {/* Mobile Number ID */}
              <label className="block text-gray-700 font-medium mb-2">
                Mobile number ID
              </label>
              <input
                type="text"
                placeholder="Enter your Meta Mobile number ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
              />

              <label className="block text-gray-700 font-medium mb-2">
                BotWot Webhook URL
              </label>
              <input
                type="text"
                placeholder="Enter your BotWot Webhook URL "
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
            </div>

            <div>
              {/* Bot Dropdown */}
              <label className="block text-gray-700 font-medium mb-2">
                Select bot
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) => setFormData({ ...formData, botId: e.target.value })}
              >
                <option value="Bot 1">Bot 1</option>
              </select>

              {/* App ID */}
              <label className="block text-gray-700 font-medium mb-2">
                App ID
              </label>
              <input
                type="text"
                placeholder="Enter your Meta app ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
              />

              {/* Business Account ID */}
              <label className="block text-gray-700 font-medium mb-2">
                Business account ID
              </label>
              <input
                type="text"
                placeholder="Enter your Meta business account ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) => setFormData({ ...formData, whatsappBusinessAccountId: e.target.value })}
              />

              <label className="block text-gray-700 font-medium mb-2">
                Secret Token
              </label>
              <input
                type="text"
                placeholder="Enter your Secret Token "
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
            </div>
          </div>

          {/* Permanent access token */}
          <label className="block text-gray-700 font-medium mb-2">
            Permanent access token given by Meta
          </label>
          <input
            type="text"
            placeholder="Enter your token"
            className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
          />
        </div>
      </div>

      {/* Modal for Secret Token and Webhook URL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={modalData} />
    </div>
  );
};

export default WhatsAppIntegration;
