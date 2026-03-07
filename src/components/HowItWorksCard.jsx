const HowItWorksCard = ({ step, icon, title, description, onWatchTutorial }) => {
  return (
    <div className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {step}
      </div>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onWatchTutorial}
        className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
      >
        Watch Tutorial
      </button>
    </div>
  );
};

export default HowItWorksCard;
