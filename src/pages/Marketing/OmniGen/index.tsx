/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const OmnigenUI = () => {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"image" | "video">("image");
  const [results] = useState<any[]>([]);

  return (
    <div className="p-6 min-h-screen  text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">
            Omnigen Content Studio
          </h2>
        </div>

        <main className="grid gap-8">
          <section className="p-8 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-black mb-4 text-2xl font-semibold">
              Create Content
            </h2>

            <div className="flex gap-4 mb-6">
              <button
                className={`px-6 py-3 rounded-lg transition-all font-medium shadow-md ${
                  mode === "image"
                    ? "bg-[#65558F] text-white shadow-[#65558F]/50"
                    : "bg-purple-200 text-[#65558F]"
                }`}
                onClick={() => setMode("image")}
              >
                Generate Image
              </button>
              <button
                className={`px-6 py-3 rounded-lg transition-all font-medium shadow-md ${
                  mode === "video"
                    ? "bg-[#65558F] text-white shadow-[#65558F]/50"
                    : "bg-purple-200 text-[#65558F]"
                }`}
                onClick={() => setMode("video")}
              >
                Generate Video
              </button>
            </div>

            <textarea
              className="w-full p-4 border-2 border-gray-600 rounded-lg min-h-[120px] mb-6 resize-y bg-gray-900 text-white focus:outline-none focus:border-purple-500"
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button className="bg-[#8AE0C1] text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-green-500/50">
              <span>✨</span>
              Generate {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          </section>

          <section>
            <h3 className="text-purple-400 mb-4 text-lg font-medium">
              Recent Creations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md"
                  >
                    {/* Result preview would go here */}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center col-span-full">
                  Your generated content will appear here
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default OmnigenUI;
