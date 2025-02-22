import React, { useState } from "react";
<<<<<<< HEAD
import { integrations } from "./integrations";
import WhatsAppIntegration from "./IntegrationApp";
import CrudIntegration from "./IntegrationApp/crudIntegration";
=======
import { useNavigate } from "react-router-dom";
import { integrations } from "./integrations";
import WhatsAppIntegration from "./IntegrationApp";
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

interface Integration {
  icon: string;
  name: string;
  description: string;
  variant: string;
  connected?: boolean;
}

const IntegrationTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
<<<<<<< HEAD
  const [activeIntegration, setActiveIntegration] = useState<string | null>(
    null
  ); // State to track the active integration
  const [showCrudIntegration, setShowCrudIntegration] = useState<boolean>(false); // State to show CrudIntegration component

  // Categorize integrations based on their variant
=======
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const navigate = useNavigate();

>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  const categories = {
    all: "All Integrations",
    communications: "Communications",
    ecommerce: "E-commerce",
    social: "Social Media",
  };

<<<<<<< HEAD
  // Map each category to relevant variants
=======
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  const categoryMapping: { [key: string]: string[] } = {
    all: [],
    communications: ["slack", "whatsapp", "linkedin"],
    ecommerce: ["shopify"],
    social: ["facebook", "instagram", "tiktok", "x"],
  };

<<<<<<< HEAD
  // Filter integrations based on the active category
=======
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  const filteredIntegrations =
    activeCategory === "all"
      ? integrations
      : integrations.filter((integration) =>
          categoryMapping[activeCategory]?.includes(integration.variant)
        );

  const handleConnectClick = (variant: string) => {
<<<<<<< HEAD
    // Mark integration as connected and navigate to its component
    if (variant === "whatsapp") {
      setActiveIntegration("whatsapp"); // Set WhatsAppIntegration as active
    }
  };

   // Handle click on Integration Details button
   const handleIntegrationDetailsClick = () => {
    setShowCrudIntegration(true); // Show CrudIntegration when the button is clicked
  };

  // Render integration cards
=======
    setActiveIntegration(variant); // Set the active integration when Connect is clicked
    navigate("/createintegration"); // Navigate to /createintegration
  };

  const handleIntegrationDetailsClick = () => {
    navigate("/integrationList"); // Navigate to /integrationList
  };

>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  const renderIntegrationCard = (integration: Integration) => (
    <div
      key={integration.name}
      className="flex flex-col items-center justify-between p-4 bg-white rounded-lg border border-solid border-gray-200 shadow-md min-w-[300px] max-w-[350px]"
    >
      <img
        src={integration.icon}
        alt={`${integration.name} logo`}
        className="object-contain w-16 h-16"
      />
      <div className="mt-4 text-center">
<<<<<<< HEAD
        <h3 className="text-lg font-semibold text-gray-800">
          {integration.name}
        </h3>
=======
        <h3 className="text-lg font-semibold text-gray-800">{integration.name}</h3>
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
        <p className="mt-2 text-sm text-gray-500">{integration.description}</p>
      </div>
      <div className="flex items-center mt-4 gap-2 w-full">
        <button
          onClick={() => handleConnectClick(integration.variant)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-full shadow-md transition-all ${
            integration.connected
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-[#65558F] text-white hover:bg-[#65558F]/85"
          }`}
        >
          {integration.connected ? "Connected" : "Connect"}
        </button>
<<<<<<< HEAD
        <button 
        onClick={handleIntegrationDetailsClick}
        className="flex-1 whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
=======
        <button
          onClick={handleIntegrationDetailsClick}
          className="flex-1 whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
        >
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
          Integration Details →
        </button>
      </div>
    </div>
  );

  // Main render
<<<<<<< HEAD
  return showCrudIntegration ? (
    // Show CrudIntegration component when state is set
    <CrudIntegration />
  ) : activeIntegration === "whatsapp" ? (
=======
  return activeIntegration === "whatsapp" ? (
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    <WhatsAppIntegration />
  ) : (
    <div className="p-6 bg-white min-h-screen">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Integrations</h1>
        <p className="mt-2 text-xl text-gray-600">
          Select and connect tools you use to integrate with your workflow
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 text-sm font-medium rounded-full ${
              activeCategory === key
                ? "text-white bg-[#65558F]"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {label}
            {key === "all" && (
              <span className="ml-2 bg-white text-gray-700 px-2 py-1 rounded-full">
                {integrations.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredIntegrations.map(renderIntegrationCard)}
      </div>
    </div>
  );
};

export default IntegrationTab;
