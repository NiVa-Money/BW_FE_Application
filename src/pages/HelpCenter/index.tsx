import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// import PlayArrowIcon from "@mui/icons-material/PlayArrow";

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
  image: string;
}

// const TutorialBackground: React.FC = () => (
//   <svg
//     className="absolute inset-0 w-full h-full"
//     viewBox="0 0 327 216"
//     preserveAspectRatio="none"
//   >
//     <defs>
//       <linearGradient id="tutorialGradient" x1="0" y1="0" x2="1" y2="1">
//         <stop offset="0%" stopColor="#edf2f7" />
//         <stop offset="100%" stopColor="#e2e8f0" />
//       </linearGradient>
//     </defs>
//     <rect width="100%" height="100%" fill="url(#tutorialGradient)" />
//   </svg>
// );

const TutorialCard: React.FC<TutorialCardProps> = ({
  badge,
  subtitle,
  image,
}) => (
  <div className="flex flex-col items-start min-w-[400px] w-[340px]">
    {/* Visual Card Block */}
    <div className="w-full h-full overflow-hidden rounded-2xl shadow-md">
      <img src={image} alt={subtitle} className="object-cover w-full h-full" />
    </div>

    {/* Separate Badge + Subtitle block */}
    <div className="flex gap-2 items-center mt-2.5">
      <div className="px-3 py-1 text-sm rounded-lg border border-solid border-zinc-600 border-opacity-20 whitespace-nowrap">
        {badge}
      </div>
      <div className="text-base text-black">{subtitle}</div>
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
    badge: "Tutorial",
    subtitle: "Build your bot in 2 steps",
    image: "/assets/HelpCenter2.png",
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
    badge: "Introduction",
    subtitle: "Build your bot in 2 steps",
    image: "/assets/HelpCenter2.png",
  },
  {
    badge: "Tutorial",
    subtitle: "Increase customer engagement",
    image: "/assets/HelpCenter3.png",
  },
];

interface FAQ {
  question: string;
  answer: string; // Added answer field
}

interface FAQSection {
  title: string;
  questions: FAQ[];
}

const dummyAnswer =
  "Shape your AI workforce to fit your business needs—no coding required. BotWot’s no-code platform lets you easily customize workflows, dialogue, and decision-making processes, empowering you to deliver tailored solutions with minimal effort.";

const faqSections: FAQSection[] = [
  {
    title: "General Questions",
    questions: [
      { question: "What is Botwot?", answer: dummyAnswer },
      { question: "Who can benefit from Botwot?", answer: dummyAnswer },
      {
        question: "Is there a coding requirement to use Botwot?",
        answer: dummyAnswer,
      },
      { question: "How much does Botwot cost?", answer: dummyAnswer },
    ],
  },
  {
    title: "Building Your Chatbot",
    questions: [
      {
        question: "What types of chatbots can I build with Botwot?",
        answer: dummyAnswer,
      },
      { question: "What features does Botwot offer?", answer: dummyAnswer },
      { question: "How do I customize my chatbot?", answer: dummyAnswer },
      {
        question: "Can I integrate Botwot with my CRM or helpdesk software?",
        answer: dummyAnswer,
      },
    ],
  },
  {
    title: "Using Your Chatbot",
    questions: [
      {
        question:
          "How do I train my chatbot to understand my customers' questions?",
        answer: dummyAnswer,
      },
      {
        question: "How do I track the performance of my chatbot?",
        answer: dummyAnswer,
      },
      {
        question:
          "What happens if my chatbot encounters a question it can't answer?",
        answer: dummyAnswer,
      },
    ],
  },
  {
    title: "Security and Privacy",
    questions: [
      { question: "Is my data safe with Botwot?", answer: dummyAnswer },
      {
        question: "How does Botwot handle customer data privacy?",
        answer: dummyAnswer,
      },
    ],
  },
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
        <div className="flex flex-col w-full min-h-[60px] max-md:max-w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex flex-wrap mt-10 gap-10 items-start py-2 w-full max-md:max-w-full">
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
              {faqSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h2 className="text-xl font-medium mb-6">{section.title}</h2>
                  <ul className="pl-4 list-disc space-y-8">
                    {section.questions.map((faq, questionIndex) => {
                      const questionKey = `${sectionIndex}-${questionIndex}`;
                      const isOpen = openQuestion === questionKey;

                      return (
                        <li
                          key={questionIndex}
                          className="text-base text-gray-700"
                        >
                          <div className="flex justify-between items-center pr-2">
                            <span>{faq.question}</span>
                            <button
                              onClick={() =>
                                setOpenQuestion(isOpen ? null : questionKey)
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
                              {/* Replace with actual answer when available */}
                              {faq.answer}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
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
