import React, { FC } from "react";
import { Quote } from "./quotes";

interface StatsDisplayProps {
  quote: Quote;
  endTime: number;
  startTime: number;
  numOfWords: number;
  onClickNextQuote: () => void;
}

const StatsDisplay: FC<StatsDisplayProps> = ({
  quote,
  endTime,
  startTime,
  numOfWords,
  onClickNextQuote,
}) => {
  const typeDurationInSeconds = (endTime - startTime) / 1000;
  const wps = numOfWords / typeDurationInSeconds;
  const wpm = Math.floor(wps * 60);

  return (
    <div className="w-full border rounded-xl p-8">
      <p className="text-xl font-bold font-sans">
        You just typed a quote from {quote.movieName}
      </p>
      <p className="mt-2 underline">Your stats:</p>
      <ul>
        <li>Words Per Minute: {wpm}</li>
        <li>Words Per Second: {wps.toFixed(2)}</li>
      </ul>
      <button
        onClick={onClickNextQuote}
        id="next_quote_button"
        className="px-4 py-2 border rounded-xl bg-blue-500 text-white mt-4"
      >
        Next Quote
      </button>
    </div>
  );
};

export default StatsDisplay;
