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
  {
    question: "What is Botwot?",
    answer:
      "BotWot iCX is an AI-first Customer Intelligence Engine that unifies marketing, sales, and service through autonomous AI agents. Designed to boost revenue, reduce operational costs, and enhance customer experiences, BotWot transforms every interaction into a growth opportunity.",
  },
  {
    question: "How can BotWot reduce my operational costs?",
    answer:
      "By automating repetitive tasks like responding to FAQs, booking appointments, lead routing, and collecting feedback, BotWot cuts down on manual work and staffing costs—while delivering faster, more accurate service.",
  },
  {
    question: "What does “multi-agent orchestration” mean?",
    answer:
      "Think of it as your AI dream team. BotWot deploys specialized agents for sales, support, marketing, and feedback—each working together in real time to deliver seamless customer journeys across every channel.",
  },
  {
    question: "Can BotWot help increase my sales?",
    answer:
      "Yes. BotWot’s Adaptive Recommendation Engine analyzes behavior in real time and pushes the right product or service at the right moment—supercharging cross-sell and upsell conversions across digital touchpoints.",
  },
  {
    question: "How soon can I see results?",
    answer:
      "Fast. BotWot’s no-code setup gets you live in minutes. Most businesses start seeing improved efficiency, higher engagement, and measurable ROI in under 14 days.",
  },
  {
    question: "Is BotWot suitable for SMBs?",
    answer:
      "Absolutely. BotWot was built to democratize AI—giving SMBs access to enterprise-grade capabilities at startup-friendly prices. Scale as you grow, without overinvesting upfront.",
  },
  {
    question: "How does BotWot boost customer retention?",
    answer:
      "By understanding customer emotions in real time, BotWot responds with empathy and context—resolving concerns proactively and helping you build deeper customer trust and loyalty.",
  },
  {
    question: "What tools does BotWot integrate with?",
    answer:
      "BotWot plugs into your ecosystem: Salesforce, HubSpot, Shopify, WooCommerce, WhatsApp, Slack, email, and major ticketing platforms. Need something custom? Our open APIs have you covered.",
  },
  {
    question: "Does BotWot support offline-to-online transitions?",
    answer:
      "Yes. If you’re starting your digital journey, BotWot gives you instant online presence with intelligent chatbots and engagement flows—no tech team needed.",
  },
  {
    question: "How secure is customer data with BotWot?",
    answer:
      "Very. We follow the highest standards—end-to-end encryption, GDPR/CCPA compliance, and strict access controls—to keep your customer data safe and confidential.",
  },
  {
    question: "Can BotWot analyze customer behavior?",
    answer:
      "Definitely. BotWot provides powerful real-time dashboards with sentiment analysis, engagement trends, and actionable insights—so you can make smarter decisions, faster.",
  },
  {
    question: "Will BotWot scale as we grow?",
    answer:
      "Yes. Whether you're managing a few hundred or a few million interactions, BotWot scales effortlessly with your business—ensuring consistent performance at every stage.",
  },
  {
    question: "How does BotWot support internal teams?",
    answer:
      "BotWot acts as your AI-powered assistant—taking care of repetitive queries, surfacing insights, and freeing up your teams to focus on strategic growth and customer delight.",
  },
  {
    question: "Can BotWot speak multiple languages?",
    answer:
      "Yes. BotWot supports multilingual conversations, helping you connect with diverse markets while maintaining a consistent brand voice and experience.",
  },
  {
    question: "Is BotWot customizable?",
    answer:
      "Completely. You can tailor workflows, conversation logic, bot tone, and branding—without writing a single line of code. It’s your AI, your way.",
  },
  {
    question: "What makes BotWot different?",
    answer:
      "BotWot isn’t just automation—it’s autonomy. With predictive intelligence, emotional context, and decision-making agents, it’s built to grow your business—not just respond to tickets.",
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
