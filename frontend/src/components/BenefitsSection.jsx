import { useState, useEffect } from "react";
import ceoImage from '../assets/ceo.jpg';
import girlImage from '../assets/girl.jpg';

const BenefitsSection = () => {
  const womenStories = [
    {
      name: "Almaz Tesfaye",
      role: "Jewelry Artisan",
      image: ceoImage,
      story:
        "Almaz started making handmade jewelry from her home. Through the platform she now sells her work to customers across Ethiopia and supports her family with her craft.",
    },
    {
      name: "Tigist Bekele",
      role: "Crochet & Textile Creator",
      image: girlImage,
      story:
        "Tigist turned her crochet passion into a growing small business. She now trains women in her community and sells handmade crochet items online.",
    },
  ];

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % womenStories.length);
        setAnimate(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const current = womenStories[index];
  const isEven = index % 2 === 0;

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center text-secondary mb-16">
          Women Inspiring Other Women
        </h2>

        <div
          className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >

          {/* STORY */}
          <div
            className={`transition-all duration-700 ${
              isEven ? "order-1 text-right" : "order-2 text-left"
            }`}
          >
            <p className="text-lg font-bold text-secondary mb-4 uppercase tracking-wide">
              {current.role}
            </p>
            <p className="text-2xl text-primary leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              {current.story}
            </p>
          </div>

          {/* WOMAN CARD */}
          <div
            className={`flex justify-center transition-all duration-700 ${
              isEven ? "order-2" : "order-1"
            }`}
          >
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-secondary to-primary flex flex-col items-center justify-center text-white p-8">

              <img
                src={current.image}
                alt={current.name}
                className="w-64 h-64 rounded-full object-cover border-8 border-white mb-6"
              />

              <h3 className="text-3xl font-bold">{current.name}</h3>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;