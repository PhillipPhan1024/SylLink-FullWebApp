import type { NextApiRequest, NextApiResponse } from "next";
import { extractTables } from "@krakz999/tabula-node";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { left, top, right, bottom } = req.body;

    const results = await extractTables(
      path.resolve("./public/Test_Syllabus.pdf"),
      {
        pages: "3",
        area: `${top},${left},${bottom},${right}`,
      }
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error extracting tables:", error);
    res.status(500).json({ error: "Failed to extract tables" });
  }
}
