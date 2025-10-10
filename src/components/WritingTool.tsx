import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WritingTool = () => {
  const [text, setText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [nextText, setNextText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const textStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    whiteSpace: 'nowrap' as const,
    fontFamily: 'IM Fell DW Pica, serif',
    fontSize: '64px',
    lineHeight: '77px',
    height: '77px',
    display: 'flex',
    alignItems: 'center'
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea || isDisappearing) return;

    const newText = e.target.value;
    
    if (newText === '') {
      setShowPlaceholder(true);
    } else {
      setShowPlaceholder(false);
    }

    textarea.style.width = '100%';

    const span = document.createElement('span');
    span.style.font = window.getComputedStyle(textarea).font;
    span.style.fontSize = '64px';
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.textContent = newText;
    document.body.appendChild(span);

    const containerWidth = textarea.clientWidth;
    const textWidth = span.offsetWidth;
    document.body.removeChild(span);

    if (textWidth > containerWidth / 2.5) {
      setIsDisappearing(true);
      setDisplayText(newText);

      const words = newText.split(' ');
      const lastWord = words[words.length - 1];
      const isLastWordIncomplete = !newText.endsWith(' ');
      const remainingText = isLastWordIncomplete ? lastWord : '';
      
      setNextText(remainingText);
      
      setTimeout(() => {
        setText(remainingText);
        setDisplayText(remainingText);
        setIsDisappearing(false);
        setNextText('');
      }, 800);
    } else {
      setText(newText);
      setDisplayText(newText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
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
          placeholder={showPlaceholder ? "Tell a story..." : ""}
          spellCheck={false}
          rows={1}
        />
        <AnimatePresence>
          {isDisappearing && (
            <motion.div 
              initial={{ opacity: 1 }}
              style={{ 
                ...textStyles,
                display: 'flex',
                gap: '0.1em'
              }}
            >
              {displayText.split('').map((char, index) => (
                <motion.span
                  key={`${index}-${char}`}
                  style={{ 
                    display: 'inline-block',
                    position: 'relative',
                    willChange: 'transform',
                    transformOrigin: 'center center'
                  }}
                  initial={{ opacity: 1, scale: 1, y: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [1, 1.1, 0.2],
                    y: [0, -20, -60],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: index * 0.04,
                    times: [0, 0.4, 1],
                    opacity: {
                      times: [0, 0.6, 1]
                    }
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
          {nextText && (
            <motion.div
              key="next-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={textStyles}
            >
              {nextText}
            </motion.div>
          )}
          {!isDisappearing && !nextText && displayText && (
            <motion.div
              ref={textRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={textStyles}
            >
              {displayText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WritingTool; 