import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = req.body;

    const prompt = `Format the following data for calendar events: ${data}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that formats data for calendar events.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    const formattedData = response.choices[0].message;

    res.status(200).json({ formattedData });
  } catch (error) {
    console.error("Error formatting data:", error);
    res.status(500).json({ error: "Error generating response from OpenAI" });
  }
}
