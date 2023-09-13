import { FormEvent, useState } from "react";
import "./App.css";
import { askAQuestion } from "./chatgpt";
import SlideShow from "./SlideShow";
import { AnswerWithImages } from "./types";

function App() {
  const [answer, setAnswer] = useState<AnswerWithImages | undefined>();
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);

  async function ask(ev: FormEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    console.log("asking ", question);

    setThinking(true);

    try {
      const response = await askAQuestion(question);

      console.log("found the answer, need the images!");

      const finalAnswer: AnswerWithImages = {
        is_appropriate: response.is_appropriate,
        items: [],
      };

      if (response.is_appropriate) {
        // const imagesForItems = await Promise.all(
        //   response.items.map(async (item) => {
        //     const images = await searchImages(item.keywords);
        //     return images[0];
        //   }),
        // );

        finalAnswer.items = response.items.map((item) => ({
          ...item,
          image: ''//imagesForItems[index]?.image,  
        }));

        setAnswer(finalAnswer);
      }
    } catch (e) {
      console.error(e);
      alert("there was an error asking the question");
    } finally {
      setThinking(false);
    }
  }

  if (thinking) {
    return <div>Please wait, thinking!</div>;
  }

  return (
    <>
      <h1>Ask a question</h1>
      <form onSubmit={ask}>
        <input
          type="text"
          value={question}
          onInput={(ev: any) => setQuestion(ev.target.value)}
        />
        <input type="submit" value="Ask" />
      </form>

      {answer && (
        <>
          <hr />
          <SlideShow slides={answer} />
        </>
      )}
    </>
  );
}

export default App;
