import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <section
      className="flex flex-col items-center p-8 bg-peach-100"
      aria-labelledby="hero-heading"
    >
      <div className="w-full mb-8">
        <h1 id="hero-heading" className="text-4xl font-bold mb-4 text-center">
          Article Title That Promises to Solve a Problem
        </h1>
      </div>

      {/* Immagine a tutta larghezza subito dopo il titolo */}
      <div className="w-full mb-8">
        <Image
          src="/path-to-office-image.jpg"
          layout="responsive"
          width={1920}
          height={1080}
          alt="Modern office space"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="md:w-1/2">
        <p className="mb-4 text-gray-600">By Nuno Gomes</p>
        <p className="mb-6 text-gray-800">
          Scrivi un articolo di massimo 1000 parole nel quale descrivi il
          problema che la tua app intende risolvere.
        </p>
        <p className="mb-6 text-gray-800">
          In conclusion, solving problems—whether they relate to productivity,
          work-life balance, or forming good habits—requires a structured
          approach, self-awareness, and perseverance. By breaking down problems,
          setting achievable goals, and adopting proven strategies like the
          Pomodoro Technique, Eisenhower Matrix, and habit-building techniques,
          you can overcome many of the challenges that life throws your way.
          Remember, the key to success is persistence, reflection, and a
          willingness to adapt. These strategies are just the beginning, and by
          applying them, you'll be well on your way to solving both the
          immediate and long-term problems in your life.
        </p>

        <button
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Try my App"
        >
          Try my App
        </button>
      </div>
    </section>
  );
};

export default Hero;
