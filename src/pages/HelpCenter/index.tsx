import React, { useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon,
  isActive,
  onClick,
}) => (
  <div
    className={`flex overflow-hidden flex-1 shrink gap-2 justify-center items-center p-2 basis-0 bg-white bg-opacity-10 border ${
      isActive ? "border-blue-500" : "border-gray-300"
    } min-w-[180px] rounded-md cursor-pointer`}
    onClick={onClick}
  >
    <div className="self-stretch my-auto text-base text-slate-700">{title}</div>
    <div className="flex gap-1.5 items-center self-stretch p-1.5 my-auto w-8 rounded-md">
      {icon}
    </div>
  </div>
);

const categories: Category[] = [
  {
    id: "faqs",
    title: "FAQs",
    icon: <HelpOutlineIcon className="w-5 h-5" />,
  },
  {
    id: "tutorials",
    title: "Tutorials",
    icon: <SchoolIcon className="w-5 h-5" />,
  },
];

interface TutorialCardProps {
  badge: string;
  subtitle: string;
  image?: string; // Made optional to support video links
  videoLink?: string; // Added to support YouTube video links
}

const TutorialCard: React.FC<TutorialCardProps> = ({
  badge,
  subtitle,
  image,
  videoLink,
}) => (
  <div className="flex flex-col items-start min-w-[400px] w-[340px]">
    {/* Visual Card Block */}
    <div className="w-full h-full overflow-hidden rounded-2xl shadow-md">
      {videoLink ? (
        <a href={videoLink} target="_blank" rel="noopener noreferrer">
          <img
            src="https://img.youtube.com/vi/PxxBpCdcoCM/maxresdefault.jpg" // YouTube thumbnail
            alt={subtitle}
            className="object-cover w-full h-full"
          />
        </a>
      ) : (
        <img
          src={image}
          alt={subtitle}
          className="object-cover w-full h-full"
        />
      )}
    </div>

    {/* Separate Badge + Subtitle block */}
    <div className="flex gap-2 items-center mt-2.5">
      <div className="px-3 py-1 text-sm rounded-lg border border-solid border-zinc-600 border-opacity-20 whitespace-nowrap">
        {badge}
      </div>
      <div className="text-base text-black">
        {videoLink ? (
          <a
            href={videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {subtitle}
          </a>
        ) : (
          subtitle
        )}
      </div>
    </div>
  </div>
);

const gettingStartedCards: TutorialCardProps[] = [
  {
    badge: "Introduction",
    subtitle: "UI kit for chat overview",
    image: "/assets/HelpCenter1.png",
  },
  {
    badge: "Video Tutorial",
    subtitle: "How to create an agent",
    videoLink: "https://youtu.be/PxxBpCdcoCM?si=fz9qNp1oGkhJUfi8",
  },
  {
    badge: "Tutorial",
    subtitle: "Increase customer engagement",
    image: "/assets/HelpCenter3.png",
  },
];

const basicTutorialsCards: TutorialCardProps[] = [
  {
    badge: "Introduction",
    subtitle: "UI kit for chat overview",
    image: "/assets/HelpCenter1.png",
  },
  {
    badge: "Tutorial",
    subtitle: "Increase customer engagement",
    image: "/assets/HelpCenter3.png",
  },
];

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  // FAQs remain unchanged, omitted for brevity
];

const HelpCenter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Tutorials");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <div className="p-6 bg-white min-h-screen">
      <header className="mb-1">
        <h1 className="text-4xl font-bold text-gray-800">Help Center</h1>
      </header>
      <div className="flex flex-col">
        {/* Categories Section */}
        <div className="flex flex-col w-full min-h-[60px]">
          <div className="flex flex-col w-full">
            <div className="flex flex-wrap justify-center mt-10 gap-10 items-start py-2 w-full max-w-[800px] mx-auto">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  title={cat.title}
                  icon={cat.icon}
                  isActive={activeCategory === cat.title}
                  onClick={() => setActiveCategory(cat.title)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col mt-6 w-full max-md:max-w-full">
          {activeCategory === "Tutorials" ? (
            <>
              {/* Getting Started Section */}
              <div className="relative w-full min-h-[346px]">
                <div className="text-base font-medium text-black">
                  Getting Started
                </div>
                <div className="relative w-full mt-4">
                  <div className="flex flex-wrap gap-10 items-center w-full max-md:max-w-full">
                    {gettingStartedCards.map((card, index) => (
                      <TutorialCard key={index} {...card} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Basic Tutorials Section */}
              <div className="relative w-full mt-6 min-h-[346px] text-black">
                <div className="text-base font-medium">Basic Tutorials</div>
                <div className="relative w-full mt-4">
                  <div className="flex flex-wrap gap-10 items-center w-full max-md:max-w-full">
                    {basicTutorialsCards.map((card, index) => (
                      <TutorialCard key={index} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : activeCategory === "FAQs" ? (
            <div className="flex flex-col gap-6 mt-4 text-black">
              <ul className="pl-4 list-disc space-y-8">
                {faqs.map((faq, index) => {
                  const isOpen = openQuestion === index.toString();

                  return (
                    <li key={index} className="text-base text-gray-700">
                      <div className="flex justify-between items-center pr-2">
                        <span>{faq.question}</span>
                        <button
                          onClick={() =>
                            setOpenQuestion(isOpen ? null : index.toString())
                          }
                        >
                          {isOpen ? (
                            <RemoveIcon className="text-gray-500 cursor-pointer" />
                          ) : (
                            <AddIcon className="text-gray-500 cursor-pointer" />
                          )}
                        </button>
                      </div>
                      {isOpen && (
                        <div className="mt-2 ml-4 text-sm text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="p-6 text-center text-xl text-gray-600">
              {activeCategory} content coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
