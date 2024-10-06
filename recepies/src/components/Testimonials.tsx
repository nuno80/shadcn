import Image from "next/image";

interface Testimonial {
  quote: string;
  name: string;
  image: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "Result Focused Quote",
      name: "Jane Doe",
      image: "/path-to-jane-image.jpg",
    },
    {
      quote: "Objection Busting Quote",
      name: "John Doe",
      image: "/path-to-john-image.jpg",
    },
    {
      quote: "Result Focused Quote",
      name: "Jane Doe",
      image: "/path-to-jane-image.jpg",
    },
  ];

  return (
    <section className="p-8 bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="text-center bg-gray-100 p-6 rounded-lg shadow-md"
          >
            <p className="mb-4 italic">"{testimonial.quote}"</p>
            <Image
              src={testimonial.image}
              width={50}
              height={50}
              alt={testimonial.name}
              className="rounded-full mx-auto mb-2"
            />
            <p className="font-bold">{testimonial.name}</p>
            <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
