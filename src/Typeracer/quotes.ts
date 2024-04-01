import quotes from "./quotes.json";

export type Quote = {
  quote: string;
  movieName: string;
};

export const randomQuote = (): Quote =>
  quotes[Math.floor(quotes.length * Math.random())];