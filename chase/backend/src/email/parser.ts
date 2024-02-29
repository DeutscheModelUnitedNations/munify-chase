import mjml2html from "mjml";

export function parse(mjml: string, variables: Record<string, string>) {
  const d = mjml2html(mjml);
  if (d.errors.length > 0) {
    throw new Error(d.errors[0]?.formattedMessage);
  }
  return replaceTemplateVariables(d.html, variables);
}

export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>,
) {
  let replaced = template;
  for (const [key, value] of Object.entries(variables)) {
    replaced = replaced.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return replaced;
}
