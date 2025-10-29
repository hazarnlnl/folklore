import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InfoPanel = () => {
  const [isFirstCardOnTop, setIsFirstCardOnTop] = useState(true);

  const toggleCards = () => {
    console.log('Card clicked, toggling state:', !isFirstCardOnTop);
    setIsFirstCardOnTop(!isFirstCardOnTop);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="info-panel-container">
      <AnimatePresence>
        <motion.div
          className={`info-card ${isFirstCardOnTop ? 'top' : 'bottom'}`}
          initial={false}
          animate={{
            zIndex: isFirstCardOnTop ? 2 : 1,
            rotate: isFirstCardOnTop ? 0 : 3,
            y: isFirstCardOnTop ? [0, -8, 0] : [-10, -15, -10],
            scale: isFirstCardOnTop ? [1, 1.005, 1] : [1, 1.005, 1]
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.8, 0.25, 1], // Even smoother spring curve
            y: {
              times: [0, 0.35, 1],
              ease: "easeInOut"
            },
            scale: {
              times: [0, 0.35, 1],
              ease: "easeInOut"
            }
          }}
          onClick={toggleCards}
          key="first-card"
        >
          <div className="info-panel">
            <div className="info-content">
              <div className="info-row">
                <div className="dot"></div>
                <span className="folklore">Memoria</span>
              </div>
              <div className="info-row">
                <span className="tool-name">Temporary writing</span>
              </div>
            </div>
            <div className="built-by">
              Built by <a href="https://hazarnl.com" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>Hazar nl</a>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`info-card ${!isFirstCardOnTop ? 'top' : 'bottom'}`}
          initial={false}
          animate={{
            zIndex: !isFirstCardOnTop ? 2 : 1,
            rotate: !isFirstCardOnTop ? 0 : 3,
            y: !isFirstCardOnTop ? [0, -8, 0] : [-10, -15, -10],
            scale: !isFirstCardOnTop ? [1, 1.005, 1] : [1, 1.005, 1]
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.8, 0.25, 1], // Even smoother spring curve
            y: {
              times: [0, 0.35, 1],
              ease: "easeInOut"
            },
            scale: {
              times: [0, 0.35, 1],
              ease: "easeInOut"
            }
          }}
          onClick={toggleCards}
          key="second-card"
        >
          <div className="info-panel secondary">
            <div className="secondary-content">
              <p>This is an experimental site exploring how some stories have always worked: not carved in stone, but carried in memory, alive because they refuse to stay fixed.</p>
              <p>In the old world, stories lived only in breath. Songs dissolved into night air. Each telling was a resurrection; each silence, a small death.</p>
              <p>Here, your words appear vivid and urgent, but temporary. Press enter and they vanish, just like our ancestors' voices, leaving only echoes.</p>
              <p>What you give to the air, the air keeps differently.</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InfoPanel; 