// pages/api/process-paypal.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { payerEmail, payerName, amount } = req.body;

    if (!payerEmail || !payerName || !amount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Simulate dummy PayPal approval URL
    const dummyApprovalUrl = `https://dummy.paypal.com/approve?email=${payerEmail}&name=${payerName}&amount=${amount}`;

    return res.status(200).json({ approvalUrl: dummyApprovalUrl });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
