import { DEFAULT_PAGE } from "@/constants";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export const MeetingsFilter = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
    agentName: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum([
      "all",
      "upcoming",
      "active",
      "completed",
      "processing",
      "cancelled",
    ])
      .withDefault("all")
      .withOptions({ clearOnDefault: true }),
  });
};
