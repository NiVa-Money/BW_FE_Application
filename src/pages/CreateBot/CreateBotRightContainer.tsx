// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import SendIcon from "@mui/icons-material/Send";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import { FormControlLabel, Switch } from "@mui/material";
// interface CreateBotRightContainerProps {
//   botName?: string;
//   imageSrc?: any;
//   theme: string;
//   color: string;
//   font: string;
//   botSmartness: string;
//   botSmartnessHandle: any;
// }
// const CreateBotRightContainer: React.FC<CreateBotRightContainerProps> = ({
//   botName,
//   imageSrc,
//   theme,
//   font,
//   color,
//   botSmartness,
//   botSmartnessHandle,
// }) => {
//   const messages: any = [
//     {
//       id: 1,
//       sender: "bot",
//       text: "Hi I’m BotWot, How can I assist you today?",
//       time: "7:30 pm",
//     },
//     {
//       id: 2,
//       sender: "user",
//       text: "I need to book an appointment",
//       time: "7:31 pm",
//     },
//     {
//       id: 3,
//       sender: "bot",
//       text: "Sure, when do you want to book this appointment?",
//       time: "7:32 pm",
//     },
//   ];

//   return (
//     <div>
//       <div className="flex flex-col h-[100%] ">
//         <div className="flex justify-end items-center">
//           <label htmlFor="botSmartness" className="text-black mr-2">
//             Bot Smartness
//           </label>
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={Boolean(botSmartness)}
//                 onClick={(e: any) => botSmartnessHandle(e.target.checked)}
//                 name="botSmartness" // Link switch to Formik field
//                 color="primary" // Customize the color
//               />
//             }
//             label=""
//             // Display the label next to the switch
//           />
//         </div>
//         <div
//           className="w-[380px] mt-10 ml-24 border border-black h-[550px] flex justify-center items-center rounded-[12px]"
//           style={{ backgroundColor: theme === "dark" ? "#1D1B20" : "#CAC4D0" }}
//         >
//           <div className="h-[100%] w-[100%] flex flex-col">
//             <div
//               className={`flex w-[100%] h-[50px] rounded-tl-[12px] rounded-tr-[12px] bg[${color}]`}
//               style={{ backgroundColor: `${color}` }}
//             >
//               <div className="p-2 flex">
//                 {imageSrc?.length ? (
//                   <img src={imageSrc} alt="logo" width={40} height={80} />
//                 ) : null}
//                 <div className="flex flex-col items-center justify-center w-full">
//                   <h3
//                     className="text-[1rem] text-center"
//                     style={{ color: theme === "dark" ? "#f3f2f6" : "#2E2F5F" }}
//                   >
//                     {botName}
//                   </h3>
//                   <h3
//                     className="text-[1rem] text-center"
//                     style={{ color: theme === "dark" ? "#f3f2f6" : "#2E2F5F" }}
//                   >
//                     Agent Role
//                   </h3>
//                 </div>
//               </div>
//             </div>
//             <hr className="border-t-1 border-black my-4 mt-0" />
//             <div className="flex p-2 flex-col gap-4">
//               {messages.map((msg: any) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${
//                     msg.sender === "bot" ? "justify-start" : "justify-end"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-xs flex justify-start items-center p-2 w-[80%] rounded-lg ${
//                       msg.sender === "bot"
//                         ? "bg-[#F3F2F6] text-gray-800"
//                         : "bg-[#3F2181] text-white"
//                     }`}
//                   >
//                     {" "}
//                     {msg?.sender === "bot" && imageSrc?.length ? (
//                       <img src={imageSrc} alt="logo" width={30} height={80} />
//                     ) : null}
//                     <div className="ml-1">
//                       <p
//                         className={`text-[0.8rem] font-[${font}] `}
//                         style={{ fontFamily: `${font}` }}
//                       >
//                         {msg.text}
//                       </p>
//                       <span
//                         className="text-xs block text-left"
//                         style={{ fontFamily: `${font}` }}
//                       >
//                         {msg.time}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex p-2 bg-[#F3F2F6] justify-between items-center h-[44px] rounded-[12px] mt-14 ">
//               <div className="flex justify-start items-center ml-[12px]">
//                 <AddPhotoAlternateIcon className="text-[#2E2F5F]" />
//                 <span
//                   className="text-[#2E2F5F]"
//                   style={{ fontFamily: `${font}` }}
//                 >
//                   {" "}
//                   Mesage
//                 </span>
//               </div>
//               <SendIcon className="mr-[12px] text-[#2E2F5F]" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBotRightContainer;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PulsingGlowLogo from "./PulsingGlowLogo";

interface CreateBotRightContainerProps {
  botName?: string;
  imageSrc?: string;
  theme: string;
  color: string;
  font: string;
  showPulsingLogo?: boolean;
  greetingMessage: string;
  agentRole?: string;
}

const CreateBotRightContainer: React.FC<CreateBotRightContainerProps> = ({
  botName,
  imageSrc,
  theme,
  font,
  color,
  showPulsingLogo,
  greetingMessage,
  agentRole = "Support Agent",
}) => {
  const effectiveGreeting =
    greetingMessage.trim() || "Hello, how can I assist you?";

  const messages = [
    {
      id: 1,
      sender: "bot",
      text: effectiveGreeting,
      time: "02:10 PM",
    },
    {
      id: 2,
      sender: "user",
      text: "Hello",
      time: "02:12 PM",
    },
  ];

  return (
    <div>
      <div className="flex flex-col h-[100%]">
        <div
          className="w-[400px] mt-10 ml-16 border border-black h-[500px] flex justify-center items-center rounded-[12px] z-10"
          style={{ backgroundColor: theme === "dark" ? "#1D1B20" : "#E3E3E3" }}
        >
          <div className="h-[100%] w-[100%] flex flex-col">
            <div
              className={`flex w-[100%] h-[50px] rounded-tl-[12px] rounded-tr-[12px]`}
              style={{ backgroundColor: `${color}` }}
            >
              <div className="p-2 flex">
                {imageSrc && (
                  <img src={imageSrc} alt="logo" width={40} height={40} />
                )}
                <div className="flex flex-col items-center justify-center w-full">
                  <h3
                    className="text-[1rem] text-center font-medium"
                    style={{
                      color: theme === "dark" ? "#f3f2f6" : "#2E2F5F",
                      fontFamily: font,
                    }}
                  >
                    {botName || "BotWot"}
                  </h3>
                  <h3
                    className="text-[0.8rem] text-center"
                    style={{
                      color: theme === "dark" ? "#f3f2f6" : "#2E2F5F",
                      fontFamily: font,
                    }}
                  >
                    {agentRole}
                  </h3>
                </div>
              </div>
            </div>
            <hr className="border-t-1 border-black my-4 mt-0" />
            <div className="flex p-2 flex-col gap-4 overflow-y-auto h-[400px]">
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-xs flex justify-start items-center p-2 w-[80%] rounded-lg ${
                      msg.sender === "bot"
                        ? "bg-[#F3F2F6] text-gray-800"
                        : "bg-[#8AE0C1] text-gray-800"
                    }`}
                  >
                    {msg.sender === "bot" && imageSrc && (
                      <img
                        src={imageSrc}
                        alt="logo"
                        width={30}
                        height={30}
                        className="mr-2"
                      />
                    )}
                    <div className="ml-1">
                      <p
                        className={`text-[0.8rem] ${
                          msg.sender === "user" ? "text-right" : "text-left"
                        }`}
                        style={{ fontFamily: font }}
                      >
                        {msg.text}
                      </p>
                      <span
                        className={`text-xs block ${
                          msg.sender === "bot" ? "text-left" : "text-right"
                        }`}
                        style={{ fontFamily: font }}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex p-2 bg-[#F3F2F6] justify-between items-center h-[44px] rounded-[12px] mt-auto mx-2 mb-2">
              <div className="flex justify-start items-center w-full">
                <input
                  type="text"
                  placeholder="Write a message"
                  className="w-full bg-transparent outline-none border-none text-[#2E2F5F] placeholder-[#2E2F5F]"
                  style={{ fontFamily: font }}
                />
                <AddPhotoAlternateIcon className="text-[#2E2F5F] mx-2" />
              </div>
              <SendIcon className="text-[#2E2F5F] mx-2" />
            </div>
          </div>
        </div>
        {showPulsingLogo && (
          <div
            className="flex justify-end items-center mb-50"
            style={{ overflow: "visible", marginBottom: "50px" }}
          >
            <PulsingGlowLogo theme={theme} imageSrc={imageSrc} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBotRightContainer;
