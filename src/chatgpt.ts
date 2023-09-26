export interface PromptResponse {
  activity: "ask_question" | "search_images" | "search_videos";
  query: string;
}

export interface Slide {
  text: string;
  keywords: string;
}

export type Answer = Slide[];

export async function prompt(question: string): Promise<PromptResponse> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stream: false,
      messages: [
        {
          content: `You are an 11 year old sibling explaining things to your 7 year old sibling named "Timmy". Do not discuss content that is not appropriate for a 7 year old sibling.`,
          role: "system",
        },
        {
          content: question,
          role: "user",
        },
      ],
      functions: [
        {
          name: "perform_activity",
          description: "Perform an activity on behalf of the user",
          parameters: {
            type: "object",
            properties: {
              activity: {
                type: "string",
                description:
                  "one of 'search_images', 'search_videos', or 'ask_question'",
              },
              query: {
                type: "string",
                description: "the query to send",
              },
            },
            required: ["activity", "query"],
          },
        },
      ],
      function_call: { name: "perform_activity" },
      model: "gpt-3.5-turbo",
    }),
  });

  const json = await response.json();

  return JSON.parse(json.choices[0].message.function_call.arguments);
}

export async function askQuestion(question: string): Promise<Answer> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stream: false,
      messages: [
        {
          content: `You are an 11 year old sibling explaining things to your 7 year old sibling named "Timmy". Do not discuss content that is not appropriate for a 7 year old sibling.`,
          role: "system",
        },
        {
          content: `The content should separated into 1 sentence slides for a presentation and should be a JSON format like the following,
          
          [
            {
              "text": "slide text",
              "keywords": "cat, in, tree"
            }
          ]

          text should be the slide text.
          keywords should be a list of keywords one could use to find images relevant to the slide.
          `,
          role: "system",
        },
        {
          content: question,
          role: "user",
        },
      ],
      model: "gpt-4",
    }),
  });

  const json = await response.json();

  return JSON.parse(json.choices[0].message.content);
}
