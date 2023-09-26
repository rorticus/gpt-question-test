import { FormEvent, useState } from "react";
import "./App.css";
import { prompt } from "./chatgpt";
import AskQuestion from "./AskQuestion";

function App() {
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  async function ask(ev: FormEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    setThinking(true);

    try {
      const response = await prompt(question);

      if (response.activity === "search_images") {
        window.open(
          `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
            response.query,
          )}`,
          "_blank",
        );
        setQuestion("");
      } else if (response.activity === "search_videos") {
        setQuestion("");
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            response.query,
          )}`,
        );
      } else if (response.activity === "ask_question") {
        setContent(<AskQuestion question={response.query} />);
      }
    } catch (e) {
      console.error(e);
      alert("there was an error asking the question");
    } finally {
      setThinking(false);
    }
  }

  if (thinking) {
    return <div>Hold on a second while I noodle this over...</div>;
  }

  return (
    <>
      {content ? (
        <div className="app-container">
          <div>{content}</div>

          <div className="app-container-done">
            <button onClick={() => setContent(null)}>I'm done.</button>
          </div>
        </div>
      ) : (
        <>
          <h1>What do you want to do?</h1>
          <form onSubmit={ask} className="ask-form">
            <input
              className="what-now"
              type="text"
              value={question}
              onInput={(ev: any) => setQuestion(ev.target.value)}
            />
            <input type="submit" value="Go!" className="go" />
            <p>
              <em>
                You can say "show me pictures of cats", "show me videos of
                puppies", or "why is the sky blue?"
              </em>
            </p>
          </form>
        </>
      )}
    </>
  );
}

export default App;
