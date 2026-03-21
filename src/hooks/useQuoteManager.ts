import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QUOTES_BY_LANGUAGE } from "@/constants/quotes";

export function useQuoteManager() {
  const { i18n } = useTranslation();
  const quotes = QUOTES_BY_LANGUAGE[i18n.language] ?? QUOTES_BY_LANGUAGE.en;

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() =>
    Math.floor(Math.random() * quotes.length),
  );
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

  const currentQuote = quotes[currentQuoteIndex];

  const getNextQuote = () => {
    let availableIndices = [];
    for (let i = 0; i < quotes.length; i++) {
      if (!usedIndices.includes(i) && i !== currentQuoteIndex) {
        availableIndices.push(i);
      }
    }

    if (availableIndices.length === 0) {
      availableIndices = [];
      for (let i = 0; i < quotes.length; i++) {
        if (i !== currentQuoteIndex) {
          availableIndices.push(i);
        }
      }
      setUsedIndices([]);
    }

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const nextIndex = availableIndices[randomIndex];

    setCurrentQuoteIndex(nextIndex);
    setUsedIndices([...usedIndices, nextIndex]);
  };

  return { currentQuote, getNextQuote };
}
