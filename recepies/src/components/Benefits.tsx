import React from "react";

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const Benefits: React.FC = () => {
  const benefits: Benefit[] = [
    {
      icon: "💎",
      title: "Benefit 1",
      description: "What feature makes this benefit possible?",
    },
    {
      icon: "🗺️",
      title: "Benefit 2",
      description: "What feature makes this benefit possible?",
    },
    {
      icon: "✈️",
      title: "Benefit 3",
      description: "What feature makes this benefit possible?",
    },
  ];

  return (
    <section className="bg-peach-100 p-8" aria-labelledby="benefits-heading">
      <h2 id="benefits-heading" className="text-3xl font-bold mb-6 text-center">
        Benefits You Can Expect
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="text-center bg-white p-6 rounded-lg shadow-md"
          >
            <div
              className="text-4xl mb-2"
              role="img"
              aria-label={benefit.title}
            >
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
