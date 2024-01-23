import { User } from "../../prisma/generated/client";
import { createTransport } from "nodemailer";
import { appConfiguration } from "../util/config";
import { accountConfirmation } from "./templates/accountConfirmation/accountConfirmation";

export type EmailTemplate = {
  subject: string;
  text: string;
};

export type AvailableEmailLocales = "de" | "en";

const mailTransport = createTransport({
  host: appConfiguration.email.EMAIL_HOST,
  port: appConfiguration.email.EMAIL_PORT,
  secure: appConfiguration.email.EMAIL_SECURE,
  auth: {
    user: appConfiguration.email.EMAIL_AUTH_USER,
    pass: appConfiguration.email.EMAIL_AUTH_PASS,
  },
});

export async function sendAccountConfirmationEmail({
  email,
  locale,
  redirectLink,
}: {
  email: Pick<User, "email">["email"];
  locale: AvailableEmailLocales;
  redirectLink: string;
}) {
  const template = accountConfirmation({
    locale,
    button_href: redirectLink,
  });

  const result = await mailTransport.sendMail({
    from: appConfiguration.email.EMAIL_FROM,
    to: email,
    html: template.text,
  });

  if (result.rejected.length > 0) {
    throw new Error(`Email to ${email} was rejected`);
  }
}
