import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchoolIcon from "@mui/icons-material/School";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

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
    <div className="self-stretch my-auto text-base text-slate-700">
      {title}
    </div>
    <div className="flex gap-1.5 items-center self-stretch p-1.5 my-auto w-8 rounded-md">
      {icon}
    </div>
  </div>
);

const categories: Category[] = [
  {
    id: "docs",
    title: "Docs",
    icon: <DescriptionIcon className="w-5 h-5" />,
  },
  {
    id: "demos",
    title: "Demos",
    icon: <OndemandVideoIcon className="w-5 h-5" />,
  },
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
}

const TutorialBackground: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 327 216"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="tutorialGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#edf2f7" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#tutorialGradient)" />
  </svg>
);

const TutorialCard: React.FC<TutorialCardProps> = ({ badge, subtitle }) => (
  <div className="flex flex-col justify-center self-stretch my-auto min-w-[240px] w-[327px]">
    <div className="flex overflow-hidden relative flex-col gap-2.5 justify-center items-center px-2.5 py-20 w-full aspect-[1.514] min-h-[216px]">
      <TutorialBackground />
      <div className="flex overflow-hidden relative gap-2 justify-center items-center self-stretch px-3 my-auto w-11 h-11 bg-blue-500 border border-gray-300 rounded-xl">
        <PlayArrowIcon className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-start self-start mt-2.5 text-black">
      <div className="p-2 text-sm whitespace-nowrap rounded-xl border border-solid border-zinc-600 border-opacity-20">
        {badge}
      </div>
      <div className="p-2 text-base leading-none">{subtitle}</div>
    </div>
  </div>
);

const gettingStartedCards: TutorialCardProps[] = [
  {
    badge: "Introduction",
    subtitle: "UI kit for chat overview",
  },
  {
    badge: "Tutorial",
    subtitle: "Build your bot in 2 steps",
  },
  {
    badge: "Tutorial",
    subtitle: "Increase customer engagement",
  },
];

const basicTutorialsCards: TutorialCardProps[] = [
  {
    badge: "Introduction",
    subtitle: "UI kit for chat overview",
  },
  {
    badge: "Introduction",
    subtitle: "Build your bot in 2 steps",
  },
  {
    badge: "Tutorial",
    subtitle: "Increase customer engagement",
  },
];

const HelpCenter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Tutorials");

  return (
    <div className="flex flex-col">
      {/* Categories Section */}
      <div className="flex flex-col w-full min-h-[60px] max-md:max-w-full">
        <div className="flex flex-col w-full max-md:max-w-full">
          <div className="flex flex-wrap mt-10 gap-4 items-start py-2 w-full max-md:max-w-full">
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
                <div className="flex flex-wrap gap-5 items-center w-full max-md:max-w-full">
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
                <div className="flex flex-wrap gap-5 items-center w-full max-md:max-w-full">
                  {basicTutorialsCards.map((card, index) => (
                    <TutorialCard key={index} {...card} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-xl text-gray-600">
            {activeCategory} content coming soon.
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;
