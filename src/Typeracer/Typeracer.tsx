import React, { useEffect, useMemo, useState } from "react";
import quotes from "./quotes.json";

type Quote = {
  quote: string;
  movieName: string;
};

const randomQuote = (): Quote => {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
};

const inputId = "typeracer-input";

const Typeracer = () => {
  const [quote, setQuote] = useState<Quote>();
  const [text, setText] = useState<string>("");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);

  const quotesSplit = useMemo(() => {
    return quote?.quote.split(" ") || [];
  }, [quote]);

  useEffect(() => {
    setQuote(randomQuote());
  }, []);

  useEffect(() => {
    setWordIndex(0);
    setText("");
  }, [quotesSplit]);

  useEffect(() => {
    setCurrentWord(quotesSplit[wordIndex]);
  }, [wordIndex, quotesSplit]);

  useEffect(() => {
    const latestLetter = text.charAt(text.length - 1);
    if (latestLetter !== " " && wordIndex !== quotesSplit.length - 1) return;

    // The below line removes any trailing spaces from the text string.
    const textWithoutTrailingSpace = text?.replace(/\s*$/, "");

    if (textWithoutTrailingSpace === currentWord) {
      setText("");
      setWordIndex(wordIndex + 1);
    }
  }, [currentWord, quotesSplit, text, wordIndex]);

  useEffect(() => {
    if (wordIndex === quotesSplit.length) {
      setQuote(randomQuote());
    }
  }, [wordIndex, quotesSplit]);

  const alreadyTypedWords = useMemo(
    () => quotesSplit.slice(0, wordIndex).join(" "),
    [quotesSplit, wordIndex]
  );

  const wordsToBeTyped = useMemo(
    () => quotesSplit.slice(wordIndex + 1, quotesSplit.length).join(" "),
    [quotesSplit, wordIndex]
  );

  const correctGreenWord = useMemo(() => {
    if (currentWord) {
      let i = 0;
      while (i < text.length) {
        if (text[i] !== currentWord[i]) {
          break;
        }
        i++;
      }
      return text.slice(0, i);
    }
    return "";
  }, [text, currentWord]);

  const wrongRedWord = useMemo(
    () => currentWord?.slice(correctGreenWord.length, text.length),
    [currentWord, correctGreenWord, text]
  );

  useEffect(() => {
    document.getElementById(inputId)?.focus();
  }, []);

  return (
    <div className="px-20 py-5">
      <h1 className="mb-4 text-3xl font-bold">Typeracer</h1>
      <span className="text-green-600">
        {alreadyTypedWords} {correctGreenWord}
      </span>
      <span className="text-red-700 bg-red-200">{wrongRedWord}</span>
      <span className="underline">{currentWord?.slice(text.length)}</span>
      <span className="text-black"> {wordsToBeTyped}</span>

      <input
        className="w-full border-black border px-4 py-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        id={inputId}
      />
    </div>
  );
};

export default Typeracer;
