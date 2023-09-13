import { useEffect, useState } from "react";
import { AnswerWithImages } from "./types";

interface SlideShowProps {
  slides: AnswerWithImages;
}

export default function SlideShow({ slides }: SlideShowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  const data = slides.items[index];

  if (!slides.is_appropriate) {
    return <div>This question is inappropriate! Naughty naughty.</div>;
  }

  return (
    <div>
      <div className="slide-container">
        <div className="slide-image">
          {data.image ? <img src={data.image} /> : null}
          {!data.image ? <span>image for "{data.keywords}"</span> : null}
        </div>
        <div className="slide-text">{data.text}</div>
      </div>
      <div className="slide-controls">
        <div>
          {index + 1} / {slides.items.length}
        </div>
        <button
          disabled={index === 0}
          onClick={() => {
            setIndex((index) => index - 1);
          }}
        >
          &lt; Prev
        </button>
        <button
          disabled={index >= slides.items.length - 1}
          onClick={() => {
            setIndex((index) => index + 1);
          }}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
