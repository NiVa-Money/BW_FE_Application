import React, { useState } from "react";

interface FormValues {
  goals: string[];
  guidelines: string[];
  newGoalPrompt: string;
  newGuidelinePrompt: string;
  botLimit: number;
}

const Settings: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    goals: [],
    guidelines: [],
    newGoalPrompt: "",
    newGuidelinePrompt: "",
    botLimit: 50,
  });

  // --- Agent Goals functions ---
  const handleGoalChange = (index: number, newValue: string) => {
    const updatedGoals = [...formValues.goals];
    updatedGoals[index] = newValue;
    setFormValues({ ...formValues, goals: updatedGoals });
  };

  const deleteGoal = (index: number) => {
    const updatedGoals = formValues.goals.filter((_, i) => i !== index);
    setFormValues({ ...formValues, goals: updatedGoals });
  };

  // --- Chat Guidelines functions ---
  const handleGuidelineChange = (index: number, newValue: string) => {
    const updatedGuidelines = [...formValues.guidelines];
    updatedGuidelines[index] = newValue;
    setFormValues({ ...formValues, guidelines: updatedGuidelines });
  };

  const deleteGuideline = (index: number) => {
    const updatedGuidelines = formValues.guidelines.filter(
      (_, i) => i !== index
    );
    setFormValues({ ...formValues, guidelines: updatedGuidelines });
  };

  // --- Bot Limit per Message ---
  // Slider limits mapped from slider index (0..3) to numeric values
  const limits = [50, 100, 250, 400];

  // Compute the slider index based on the current botLimit
  const sliderIndex =
    formValues.botLimit <= 20
      ? 0
      : formValues.botLimit <= 100
      ? 1
      : formValues.botLimit <= 250
      ? 2
      : 3;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Agent Guidelines</h1>

      {/* Agent Goals */}
      <div className="flex flex-col w-full mb-8 text-black">
        <div className="mb-2">
          <label className="text-lg font-medium">Agent Goals</label>
        </div>
        {formValues.goals.map((goal, index) => (
          <div key={index} className="relative mb-3">
            <input
              type="text"
              value={goal}
              onChange={(e) => handleGoalChange(index, e.target.value)}
              className="h-12 w-full rounded-xl bg-[#F3F2F6] px-4 pr-10"
              placeholder="Your main goal is to assist customers in their shopping journey."
            />
            <button
              onClick={() => deleteGoal(index)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>
          </div>
        ))}

        {/* New input field with AI Gen button */}
        <div className="flex items-center">
          <input
            type="text"
            value={formValues.newGoalPrompt}
            onChange={(e) =>
              setFormValues({ ...formValues, newGoalPrompt: e.target.value })
            }
            className="h-12 flex-grow rounded-l-xl bg-[#F3F2F6] px-4"
            placeholder="Enter a prompt for goal generation..."
          />
          <button
            className="bg-[#65558F] text-white h-12 px-4 rounded-r-xl"
            onClick={() => {
              if (formValues.newGoalPrompt) {
                // Simulate AI generation
                const generatedGoal =
                  "Help customers find products that match their needs and provide support during their shopping journey.";
                setFormValues({
                  ...formValues,
                  goals: [...formValues.goals, generatedGoal],
                  newGoalPrompt: "",
                });
              }
            }}
          >
            AI Gen
          </button>
        </div>
      </div>

      {/* Chat Guidelines */}
      <div className="flex flex-col w-full mb-8 text-black">
        <div className="mb-2">
          <label className="text-lg font-medium">Chat Guidelines</label>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Set clear rules for how your agent should respond in chat channels
        </p>
        {formValues.guidelines.map((guideline, index) => (
          <div key={index} className="relative mb-3">
            <input
              type="text"
              value={guideline}
              onChange={(e) => handleGuidelineChange(index, e.target.value)}
              className="h-12 w-full rounded-xl bg-[#F3F2F6] px-4 pr-10"
              placeholder="For example: Always greet the customer politely."
            />
            <button
              onClick={() => deleteGuideline(index)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>
          </div>
        ))}

        {/* New input field with AI Gen button */}
        <div className="flex items-center">
          <input
            type="text"
            value={formValues.newGuidelinePrompt}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                newGuidelinePrompt: e.target.value,
              })
            }
            className="h-12 flex-grow rounded-l-xl bg-[#F3F2F6] px-4"
            placeholder="Enter a prompt for guideline generation..."
          />
          <button
            className="bg-[#65558F] text-white h-12 px-4 rounded-r-xl"
            onClick={() => {
              if (formValues.newGuidelinePrompt) {
                // Simulate AI generation
                const generatedGuideline =
                  "Always respond within 30 seconds and maintain a friendly, helpful tone with customers.";
                setFormValues({
                  ...formValues,
                  guidelines: [...formValues.guidelines, generatedGuideline],
                  newGuidelinePrompt: "",
                });
              }
            }}
          >
            AI Gen
          </button>
        </div>
      </div>

      {/* Bot Limit per Message */}
      <div className="flex flex-col w-full mb-8 text-black">
        <label className="text-lg font-medium mb-4">
          Bot limit per Message
        </label>
        <div className="w-full">
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={sliderIndex}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setFormValues({ ...formValues, botLimit: limits[val] });
            }}
            className="w-full h-2 bg-[#E0DFE6] rounded-lg appearance-none cursor-pointer"
            style={{
              backgroundImage: "linear-gradient(to right, #65558F, #65558F)",
              backgroundSize: `${(sliderIndex / 3) * 100}% 100%`,
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="flex justify-between mt-4 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-medium">Minimalist</span>
              <span className="text-gray-500">10-20 char</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">Short</span>
              <span className="text-gray-500">50-100</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">Long</span>
              <span className="text-gray-500">100-250</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">Chatty</span>
              <span className="text-gray-500">250+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
