import React from 'react';
import WhatsappCampaign from './WhatsappCampaign';


const Campaign: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Pass the onSubmit prop to the WhatsappCampaign component */}

      <WhatsappCampaign/>
      
    </div>
  );
};

export default Campaign;
