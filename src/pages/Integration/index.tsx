import React, { useState } from "react";
import { integrations } from "./integrations";
import WhatsAppIntegration from "./IntegrationApp";
import CrudIntegration from "./IntegrationApp/crudIntegration";

interface Integration {
  icon: string;
  name: string;
  description: string;
  variant: string;
  connected?: boolean;
}

const IntegrationTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeIntegration, setActiveIntegration] = useState<string | null>(
    null
  ); // State to track the active integration
  const [showCrudIntegration, setShowCrudIntegration] = useState<boolean>(false); // State to show CrudIntegration component

  // Categorize integrations based on their variant
  const categories = {
    all: "All Integrations",
    communications: "Communications",
    ecommerce: "E-commerce",
    social: "Social Media",
  };

  // Map each category to relevant variants
  const categoryMapping: { [key: string]: string[] } = {
    all: [],
    communications: ["slack", "whatsapp", "linkedin"],
    ecommerce: ["shopify"],
    social: ["facebook", "instagram", "tiktok", "x"],
  };

  // Filter integrations based on the active category
  const filteredIntegrations =
    activeCategory === "all"
      ? integrations
      : integrations.filter((integration) =>
          categoryMapping[activeCategory]?.includes(integration.variant)
        );

  const handleConnectClick = (variant: string) => {
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
        <h3 className="text-lg font-semibold text-gray-800">
          {integration.name}
        </h3>
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
        <button 
        onClick={handleIntegrationDetailsClick}
        className="flex-1 whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
          Integration Details →
        </button>
      </div>
    </div>
  );

  // Main render
  return showCrudIntegration ? (
    // Show CrudIntegration component when state is set
    <CrudIntegration />
  ) : activeIntegration === "whatsapp" ? (
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
