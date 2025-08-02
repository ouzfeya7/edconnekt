import React, { useState } from 'react';

interface SiteSpeakAIChatbotProps {
  className?: string;
  isFloating?: boolean;
}

const SiteSpeakAIChatbot: React.FC<SiteSpeakAIChatbotProps> = ({ 
  className = '', 
  isFloating = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  if (isFloating) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        {/* Bouton flottant pour ouvrir/fermer le chatbot */}
        <button
          onClick={toggleChatbot}
          className="bg-white hover:bg-gray-50 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200"
          aria-label="Ouvrir l'assistant IA"
        >
          <svg 
            width="44" 
            height="41" 
            viewBox="0 0 44 41" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-13"
          >
            <path d="M30.2708 13.2305L13.6768 12.2858L12.1218 12.4924L10.4133 14.6866L9.93016 17.1684L9.88947 18.8456L26.5313 19.7074L30.2708 13.2305Z" fill="#068789"/>
            <path d="M13.5736 27.3277L30.1603 28.393L31.7167 28.1977L33.4411 26.0161L33.9424 23.5378L33.9952 21.8609L17.3601 20.8781L13.5736 27.3277Z" fill="#FFC903"/>
            <path d="M8.64386 20.834C10.9984 25.0678 17.7949 34.7626 17.7949 34.7626L21.5384 28.2786L12.3874 14.35C11.6235 12.6593 12.3869 12.5247 13.7382 12.2865L13.7799 12.2791L11.8835 12.1782C6.86962 12.2834 6.28929 16.6001 8.64386 20.834Z" fill="#068789"/>
            <path d="M35.255 19.8813C32.9313 15.6304 26.2055 5.88647 26.2055 5.88647L22.4149 12.343L31.4644 26.3378C32.2159 28.0341 31.4515 28.1631 30.0986 28.3915L30.0569 28.3985L31.9524 28.5133C36.9669 28.4445 37.5787 24.1322 35.255 19.8813Z" fill="#FFC903"/>
          </svg>
        </button>

        {/* Chatbot iframe - Interface SiteSpeakAI native */}
        {isOpen && (
          <div className="absolute bottom-16 right-0">
            <iframe 
              className="sitespeak-ai-chatbot" 
              src="https://chatbot.sitespeak.ai/embed/9444ca32-dad0-40b5-b99b-cc9f72612b28?nc" 
              allow="microphone;" 
              frameBorder="0" 
              style={{
                border: '2px solid #D8DCFB',
                overflow: 'hidden',
                borderRadius: '8px',
                width: '380px',
                height: '500px',
                boxShadow: '0 10px 25px rgba(216, 220, 251, 0.2)'
              }}
              title="Assistant IA EdConnekt"
            />
          </div>
        )}
      </div>
    );
  }

  // Version intégrée (non-flottante) - Interface SiteSpeakAI native
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <iframe 
        className="sitespeak-ai-chatbot w-full" 
        src="https://chatbot.sitespeak.ai/embed/9444ca32-dad0-40b5-b99b-cc9f72612b28?nc" 
        allow="microphone;" 
        frameBorder="0" 
        style={{
          border: '2px solid #D8DCFB',
          overflow: 'hidden',
          borderRadius: '8px',
          height: '500px',
          boxShadow: '0 10px 25px rgba(216, 220, 251, 0.2)'
        }}
        title="Assistant IA EdConnekt"
      />
    </div>
  );
};

export default SiteSpeakAIChatbot; 