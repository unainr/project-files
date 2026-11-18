import { customAlphabet } from "nanoid";

// lowercase + digits: URL-safe, double-click selectable
const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);

const make = (prefix: string) => () => `${prefix}_${nano()}`;

export const newId = {
  project: make("prj"),
  apiKey: make("key"),
  trace: make("trc"),
  span: make("spn"),
};