import React, { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const phoneNumber = '+918950026639';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message || 'Hi! I want to know more about courses at SJS Academy.')}`;

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaWhatsapp size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl w-80 z-50 overflow-hidden"
          >
            <div className="bg-green-500 text-white p-4">
              <h3 className="font-bold text-lg">Chat with us on WhatsApp</h3>
              <p className="text-sm">We usually reply within minutes</p>
            </div>
            
            <div className="p-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                rows="3"
              />
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-500 hover:bg-green-600 text-white text-center font-semibold py-2 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Start Chat →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppButton;