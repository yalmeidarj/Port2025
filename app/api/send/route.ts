import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // Choose where the message goes
  const to =
    process.env.NODE_ENV === "production"
      ? process.env.RESEND_TO
      : process.env.TEST_EMAIL;

  try {
    /* ---------------------------------------------------------------
     * 1. Parse the classic <form> submission
     * ------------------------------------------------------------- */
    const data = await req.formData(); // <-- works for url-encoded or multipart
    const first = (data.get("first") ?? "") as string;
    const last = (data.get("last") ?? "") as string;
    const email = (data.get("email") ?? "") as string;
    const message = (data.get("message") ?? "") as string;

    /* ---------------------------------------------------------------
     * 2. Fire the e-mail
     * ------------------------------------------------------------- */
    await resend.emails.send({
      from: process.env.RESEND_FROM!, // verified sender
      to: to!,
      subject: `TDX Website Contact – ${first} ${last}`,
      replyTo: email,
      html: `
        <p><strong>Name:</strong> ${first} ${last}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    /* ---------------------------------------------------------------
     * 3. Return 200 so the browser stays on the page
     * ------------------------------------------------------------- */
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact-route]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
