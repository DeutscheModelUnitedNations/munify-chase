import { appConfiguration } from "../../../util/config";
import type { AvailableEmailLocales, EmailTemplate } from "../../email";
import { parse, replaceTemplateVariables } from "../../parser";
import template from "./template.mjml";
import { readFile } from "node:fs/promises";

const de_subject = `${appConfiguration.appName} - Account bestätigen`;
const de = parse(await readFile(template, { encoding: "utf8" }), {
  locale: "de",
  title: `Willkommen bei ${appConfiguration.appName}!`,
  text: "Für diese E-Mail-Adresse wurde ein Account bei CHASE erstellt. Bitte bestätige die E-Mail-Adresse durch Klicken auf den nachfolgenden Link. Wenn diese E-Mail irrtümlich versendet wurde, kann sie einfach ignoriert werden.",
  button_label: "Account bestätigen",
  greetings: "Mit freundlichen Grüßen, das Team von CHASE, DMUN e.V.",
  disclaimer:
    "CHASE wird entwickelt und ist Teil von Deutsche Model United Nations (DMUN) e.V. eingetragen im Vereinsregister des Amtsgerichts Stuttgart unter der Registernummer VR 6921. Die USt-IdNr lautet DE238582245. Diese E-Mail wurde automatisch versendet, weil ein Account für CHASE, die Konferenzverwaltungssoftware von DMUN e.V. angelegt wurde. Zu Fragen und Auskünften gilt das Impressum des Vereins unter https://www.dmun.de/impressum",
});

const en_subject = `${appConfiguration.appName} - Confirm account`;
const en = parse(await readFile(template, { encoding: "utf8" }), {
  locale: "en",
  title: `Welcome to ${appConfiguration.appName}!`,
  text: "A CHASE account has been created for this e-mail address. Please confirm the e-mail address by clicking on the following link. If this e-mail was sent in error, it can simply be ignored.",
  button_label: "Confirm account",
  greetings: "Best regards, the team of CHASE, DMUN e.V.",
  disclaimer:
    "CHASE is developed and is part of Deutsche Model United Nations (DMUN) e.V. registered in the register of associations of the district court of Stuttgart under the registration number VR 6921. The VAT ID number is DE238582245. This e-mail was sent automatically because an account for CHASE, the conference management software of DMUN e.V. was created. For questions and information, please refer to the association's legal notice at https://www.dmun.de/impressum",
});

export function emailConfirmation({
  locale,
  button_href,
}: {
  locale: AvailableEmailLocales;
  button_href: string;
}): EmailTemplate {
  if (locale === "de") {
    return {
      subject: de_subject,
      text: replaceTemplateVariables(de, {
        button_href,
      }),
    };
  }

  if (locale === "en") {
    return {
      subject: en_subject,
      text: replaceTemplateVariables(en, {
        button_href,
      }),
    };
  }

  throw new Error(`Unknown locale ${locale}`);
}
