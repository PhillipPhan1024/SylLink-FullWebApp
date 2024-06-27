import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { left, top, width, height } = req.body;
    const right = left + width;
    const bottom = top + height;

    const newData = { left, top, width, height, right, bottom };

    console.log("Received data:", newData);

    const response = await fetch("http://localhost:3000/api/extractTables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error("Failed to extract tables");
    }

    const extractionResults = await response.json();

    const openAIResponse = await fetch("http://localhost:3000/api/formatData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: extractionResults }),
    });

    if (!openAIResponse.ok) {
      throw new Error("Failed to format data");
    }

    const { formattedData } = await openAIResponse.json();

    res.status(200).json({
      message: "Data received and tables extracted successfully",
      data: newData,
      extractionResults,
      formattedData,
    });
  } catch (error) {
    console.error("Error receiving or forwarding data:", error);
    res.status(500).json({ error: "Failed to receive or forward data" });
  }
}
