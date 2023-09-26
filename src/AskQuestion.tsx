import { useEffect, useState } from "react";
import { Answer, askQuestion } from "./chatgpt";

export default function AskQuestion({ question }: { question: string }) {
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<Answer | undefined>(undefined);

  useEffect(() => {
    async function work() {
      try {
        const response = await askQuestion(question);
        setSlides(response);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    work();
  }, []);

  return (
    <div>
      {loading && (
        <div>
          <h2>{question}</h2>
          <p>
            Wow! What a great question. Give me a minute to come up with a great
            answer.
          </p>
        </div>
      )}
      {!loading && (
        <div>
          <ol>{slides?.map((slide) => <li>{slide.text}</li>)}</ol>
        </div>
      )}
    </div>
  );
}
