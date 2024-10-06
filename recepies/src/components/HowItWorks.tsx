import React from "react";

interface Step {
  icon: string;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      icon: "📅",
      title: "Step 1: Schedule your visit",
      description:
        "Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: "📋",
      title: "Step 2: We handle the details",
      description:
        "Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: "😊",
      title: "Step 3: Collaborate, create & excel",
      description:
        "Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  return (
    <section
      className="bg-peach-100 p-8"
      aria-labelledby="how-it-works-heading"
    >
      <h2
        id="how-it-works-heading"
        className="text-3xl font-bold mb-6 text-center"
      >
        How it Works
      </h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start bg-white p-4 rounded-lg shadow-md"
          >
            <div className="text-4xl mr-4" role="img" aria-label={step.title}>
              {step.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
