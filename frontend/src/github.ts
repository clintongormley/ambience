/** The Ambience GitHub repository — the single source for issue/PR deep-links. */
export const GITHUB_REPO_URL = "https://github.com/clintongormley/ambience";

/**
 * Build a prefilled "new issue" URL requesting a translation for `code`
 * (display name `displayName`). Uses `?body=` rather than `?template=`: a
 * `template=NAME.md` link resolves the template against the repo's DEFAULT
 * branch, so the body is blank until the template is merged — `?body=` prefills
 * immediately and injects the language. The translation_request.md template
 * still serves the manual "New issue" path.
 */
export function buildTranslationRequestUrl(code: string, displayName: string): string {
  const params = new URLSearchParams({
    labels: "translation",
    title: `Translation request: ${displayName} (${code})`,
    body: [
      `I'd like Ambience to be translated into: **${displayName}** (\`${code}\`).`,
      ``,
      `- [ ] I'm happy to review the translations`,
    ].join("\n"),
  });
  return `${GITHUB_REPO_URL}/issues/new?${params.toString()}`;
}
