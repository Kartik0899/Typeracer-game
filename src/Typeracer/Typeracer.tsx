import React, { useEffect, useMemo, useState } from "react";
import { Quote, randomQuote } from "./quotes";
import StatsDisplay from "./stats_display";
import { GameState } from "./game_state";

const inputId = "typeracer-input";

const Typeracer = () => {
  const [quote, setQuote] = useState<Quote>();
  const [text, setText] = useState<string>("");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);

  const [gameState, setGameState] = useState(GameState.WAITING);

  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

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

  //   useEffect(() => {
  //     if (wordIndex === quotesSplit.length) {
  //       setQuote(randomQuote());
  //     }
  //   }, [wordIndex, quotesSplit]);

  useEffect(() => {
    setGameState(GameState.PLAYING);
  }, []);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      setQuote(randomQuote());
    }
  }, [gameState]);

  // we set gameState=VIEW_STATS when the player have finished typing
  useEffect(() => {
    const quoteFinished =
      quotesSplit.length === wordIndex && quotesSplit.length !== 0;

    if (quoteFinished) {
      setGameState(GameState.VIEW_STATS);
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

  //   useEffect(() => {
  //     document.getElementById(inputId)?.focus();
  //   }, []);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      document.getElementById(inputId)?.focus(); // add this line
      setQuote(randomQuote());
      setStartTime(Date.now());
    }
    if (gameState === GameState.VIEW_STATS) {
      setEndTime(Date.now());
    }
  }, [gameState]);

  const nextQuote = () => {
    setGameState(GameState.PLAYING);
  };

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      setQuote(randomQuote());
      setStartTime(Date.now()); // add this line to an existing useEffect
    }
    if (gameState === GameState.VIEW_STATS) {
      setEndTime(Date.now()); // add this line to an existing useEffect
    }
  }, [gameState]);

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
        disabled={gameState === GameState.VIEW_STATS}
      />

      {quote && gameState === GameState.VIEW_STATS && (
        <StatsDisplay
          startTime={startTime}
          endTime={endTime}
          quote={quote}
          numOfWords={quotesSplit.length}
          onClickNextQuote={nextQuote}
        />
      )}
    </div>
  );
};

export default Typeracer;
