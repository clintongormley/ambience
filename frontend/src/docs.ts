/** Base URL of the published documentation site (GitHub Pages). Kept in one
 *  place so every in-app help link points at the same origin. */
export const DOCS_BASE_URL = "https://clintongormley.github.io/ambience";

/** Build an absolute docs URL from a site-relative path like
 *  "reference/conditions/lux". mkdocs serves directory-style URLs, so the
 *  result always ends in a slash. */
export function docUrl(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `${DOCS_BASE_URL}/${clean}/` : `${DOCS_BASE_URL}/`;
}

/** Map a condition's backend kind `name` to its documentation slug. Most kinds
 *  match their slug 1:1; only `state` and `time_of_day` differ. */
const CONDITION_DOC_SLUGS: Record<string, string> = {
  day: "day",
  state: "entity-state",
  lux: "lux",
  occupancy: "occupancy",
  people: "people",
  script: "script",
  sun: "sun",
  template: "template",
  time_of_day: "time-of-day",
  unavailable: "unavailable",
  weather: "weather",
};

/** Site-relative docs path for a condition kind, or undefined if none maps. */
export function conditionDocPath(name: string): string | undefined {
  const slug = CONDITION_DOC_SLUGS[name];
  return slug ? `reference/conditions/${slug}` : undefined;
}
