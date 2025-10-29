import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WritingTool = () => {
  const [text, setText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animatedChars, setAnimatedChars] = useState<Set<number>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const textStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    whiteSpace: 'pre-wrap' as const,
    fontFamily: 'Noto Serif Telugu, serif',
    fontSize: '24px',
    lineHeight: '1.5',
    minHeight: '77px'
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea || isDisappearing || isFinished) return;

    const newText = e.target.value;
    
    if (newText === '') {
      setShowPlaceholder(true);
      setAnimatedChars(new Set());
    } else {
      setShowPlaceholder(false);
    }

    setText(newText);
    setDisplayText(newText);
    
    // Add new characters to animated set
    if (newText.length > displayText.length) {
      const newAnimatedChars = new Set(animatedChars);
      for (let i = displayText.length; i < newText.length; i++) {
        newAnimatedChars.add(i);
      }
      setAnimatedChars(newAnimatedChars);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFinish();
    }
  };

  const handleFinish = () => {
    if (text.trim() === '' || isDisappearing) return;
    
    setIsDisappearing(true);
    setIsFinished(true);
    
    // Reset after animation completes
    setTimeout(() => {
      setText('');
      setDisplayText('');
      setShowPlaceholder(true);
      setIsDisappearing(false);
      setIsFinished(false);
      setAnimatedChars(new Set());
      
      // Use requestAnimationFrame to ensure focus happens after state updates
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }, 1800); // Slightly longer than animation duration
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="writing-tool">
      <div className="text-container">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="text-input"
          placeholder=""
          spellCheck={false}
          rows={1}
          disabled={isFinished}
        />
        {showPlaceholder && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              ...textStyles,
              color: 'rgba(240, 240, 240, 0.3)',
              pointerEvents: 'none'
            }}
          >
            Tell a story...
          </motion.div>
        )}
        <AnimatePresence>
          {isDisappearing && (
            <motion.div 
              initial={{ opacity: 1, filter: 'blur(0px)' }}
              animate={{
                opacity: 0,
                filter: 'blur(10px)'
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut"
              }}
              style={textStyles}
            >
              {displayText}
            </motion.div>
          )}
          {!isDisappearing && displayText && (
            <div
              ref={textRef}
              style={textStyles}
            >
              {displayText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ 
                    opacity: animatedChars.has(index) ? 1 : 0, 
                    filter: animatedChars.has(index) ? 'blur(0px)' : 'blur(10px)'
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut"
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {!isFinished && text.trim() && (
        <>
          <motion.div
            className="enter-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Enter to finish
          </motion.div>
          <motion.div
            className="send-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            (send)
          </motion.div>
        </>
      )}
    </div>
  );
};

export default WritingTool; 