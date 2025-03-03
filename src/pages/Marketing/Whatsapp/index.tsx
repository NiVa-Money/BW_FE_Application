import React from "react";
import WhatsappDash from "./WhatsappDashboard";

const WhatsApp: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <WhatsappDash totalMessages={0} seenMessages={0} deliveredMessages={0} unreadMessages={0} hotLeads={0} campaignName={""} />
    </div>
  );
};

export default WhatsApp;
