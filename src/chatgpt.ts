export interface Answer {
  items: Slide[];
  is_appropriate: boolean;
}

export interface Slide {
  text: string;
  keywords: string;
}

export async function askAQuestion(question: string): Promise<Answer> {
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
          content: `You are an 11 year old sibling explaining things to your 7 year old sibling named "Timmy". Do not discuss content that is not appropriate for a 7 year old sibling. Your response will be displayed as slides, with each slide having one sentence of text and a corresponding image. Suggest appropriate keywords for finding relavant images using a google image search.`,
          role: "system",
        },
        {
          content: "You are talking to your little sibling Timmy. Timmy is 7 years old and likes soccer.  Talk to Timmy like you are talking to your little sibling.",
          role: "system"
        },
        {
          content: question,
          role: "user",
        },
      ],
      function_call: { name: "add_slides" },
      functions: [
        {
          name: "add_slides",
          description: "Use this function to add a slides to the response.",
          parameters: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  description: "The information for one single slide.",
                  properties: {
                    text: {
                      type: "string",
                      description:
                        "The text for this one slide. Your text should target a 7 year old child named Timmy. Use language appropriate for a 7 year old child.",
                    },
                    keywords: {
                      type: "string",
                      description:
                        "Suggested keywords to search for to find a relavant image for the slide",
                    },
                  },
                },
              },
              is_appropriate: {
                type: "boolean",
                description:
                  "Whether or not this question is appropriate for a 7 year old.",
              },
            },
            required: ["items", "is_appropriate"],
          },
        },
      ],
      model: "gpt-3.5-turbo",
    }),
  });

  const json = await response.json();

  return JSON.parse(json.choices[0].message.function_call.arguments);
}
