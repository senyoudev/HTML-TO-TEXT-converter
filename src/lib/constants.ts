import { ConversionOptions } from "./types";

export const DEFAULT_OPTIONS: Required<ConversionOptions> = {
  preserveNewlines: true,
  wordwrap: 80,
  preserveLinks: true,
  preserveImages: true,
  customReplacements: [],
  debugMode: false,
};