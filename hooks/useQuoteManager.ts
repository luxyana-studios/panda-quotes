import { useState } from "react";
import { RED_PANDA_QUOTES } from "@/constants/quotes";

export function useQuoteManager() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() =>
    Math.floor(Math.random() * RED_PANDA_QUOTES.length)
  );
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

  const currentQuote = RED_PANDA_QUOTES[currentQuoteIndex];

  const getNextQuote = () => {
    // Get available indices (not yet used)
    let availableIndices = [];
    for (let i = 0; i < RED_PANDA_QUOTES.length; i++) {
      if (!usedIndices.includes(i) && i !== currentQuoteIndex) {
        availableIndices.push(i);
      }
    }

    // If all quotes have been used, reset
    if (availableIndices.length === 0) {
      availableIndices = [];
      for (let i = 0; i < RED_PANDA_QUOTES.length; i++) {
        if (i !== currentQuoteIndex) {
          availableIndices.push(i);
        }
      }
      setUsedIndices([]);
    }

    // Pick random index from available
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const nextIndex = availableIndices[randomIndex];

    setCurrentQuoteIndex(nextIndex);
    setUsedIndices([...usedIndices, nextIndex]);
  };

  return { currentQuote, getNextQuote };
}
