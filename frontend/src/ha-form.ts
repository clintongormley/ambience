/**
 * Shared `<ha-form>` schema item types.
 *
 * `<ha-form>` is driven by an array of schema items, each naming a field and
 * carrying a selector that HA renders into the appropriate widget. These loose
 * shapes used to be redeclared in every view that builds a form; they live here
 * now so all views share a single definition.
 */

/** A single ha-form schema item with a required selector. */
export type HaFormSchema = {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
};

/** ha-form schema item where the selector may be absent and an optional
 *  `description` carries a suggested value or hint suffix. */
export type HaFormSchemaEntry = {
  name: string;
  selector?: unknown;
  required?: boolean;
  description?: { suggested_value?: unknown } | string;
};
