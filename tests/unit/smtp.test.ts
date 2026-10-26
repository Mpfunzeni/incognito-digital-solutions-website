import { createServer, type AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { deliverQuote } from "@/lib/email";
import { replyToAddress } from "@/lib/hosting/mailer";
import { emailDeliveryEnabled, smtpFrom } from "@/lib/smtp";

const q = {
  fullName: "Thandi Test",
  businessName: "",
  email: "thandi@example.com",
  phone: "",
  service: "SEO",
  budget: "",
  message: "Please quote for SEO.",
  contactMethod: "Email",
  consent: true,
  website: "",
  startedAt: 1,
} as never;

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

/** A minimal SMTP server that records the conversation. */
function fakeSmtp() {
  const log: string[] = [];
  const server = createServer((socket) => {
    let data = false;
    socket.write("220 fake ESMTP\r\n");
    socket.on("data", (chunk) => {
      for (const line of chunk.toString().split("\r\n").filter(Boolean)) {
        log.push(line);
        if (data) {
          if (line === ".") {
            data = false;
            socket.write("250 queued as abc\r\n");
          }
          continue;
        }
        const cmd = line.slice(0, 4).toUpperCase();
        if (cmd === "EHLO") socket.write("250-fake\r\n250 AUTH PLAIN LOGIN\r\n");
        else if (cmd === "AUTH") socket.write("235 ok\r\n");
        else if (cmd === "DATA") {
          data = true;
          socket.write("354 go\r\n");
        } else if (cmd === "QUIT") socket.end("221 bye\r\n");
        else socket.write("250 ok\r\n");
      }
    });
  });
  return new Promise<{ port: number; log: string[]; close: () => void }>((resolve) =>
    server.listen(0, "127.0.0.1", () =>
      resolve({ port: (server.address() as AddressInfo).port, log, close: () => server.close() }),
    ),
  );
}

describe("smtp email", () => {
  it("reports whether delivery is switched on", () => {
    expect(emailDeliveryEnabled({ QUOTE_DELIVERY: "smtp", SMTP_USER: "a@gmail.com", SMTP_PASS: "x" })).toBe(true);
    expect(emailDeliveryEnabled({ QUOTE_DELIVERY: "smtp", SMTP_USER: "a@gmail.com" })).toBe(false);
    expect(emailDeliveryEnabled({ QUOTE_DELIVERY: "resend", RESEND_API_KEY: "k" })).toBe(true);
    expect(emailDeliveryEnabled({})).toBe(false);
  });

  it("uses the Gmail mailbox as sender and reply-to by default", () => {
    expect(smtpFrom({ SMTP_USER: "owner@gmail.com" })).toBe("Incognito Digital Solutions <owner@gmail.com>");
    expect(replyToAddress({ QUOTE_DELIVERY: "smtp", SMTP_USER: "owner@gmail.com" })).toBe("owner@gmail.com");
    expect(replyToAddress({ QUOTE_DELIVERY: "smtp", SMTP_USER: "owner@gmail.com", REPLY_TO_EMAIL: "r@x.co" })).toBe("r@x.co");
  });

  it("fails safely when SMTP is selected without a password", async () => {
    process.env.QUOTE_DELIVERY = "smtp";
    process.env.SMTP_USER = "owner@gmail.com";
    delete process.env.SMTP_PASS;
    expect((await deliverQuote(q)).ok).toBe(false);
  });

  it("sends a quote through the SMTP server to the owner's mailbox", async () => {
    const smtp = await fakeSmtp();
    try {
      Object.assign(process.env, {
        QUOTE_DELIVERY: "smtp",
        SMTP_USER: "owner@gmail.com",
        SMTP_PASS: "abcd efgh ijkl mnop",
        SMTP_HOST: "127.0.0.1",
        SMTP_PORT: String(smtp.port),
      });
      delete process.env.QUOTE_TO_EMAIL;
      const r = await deliverQuote(q);
      expect(r.ok).toBe(true);
      const all = smtp.log.join("\n");
      expect(all).toContain("RCPT TO:<owner@gmail.com>");
      expect(all).toMatch(/Reply-To: thandi@example\.com/i);
      expect(all).toContain("Quote request: SEO from Thandi Test");
    } finally {
      smtp.close();
    }
  });
});
