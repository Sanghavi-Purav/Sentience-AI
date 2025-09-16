import { DEFAULT_PAGE } from "@/constants";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const MeetingsFilterServer = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  status: parseAsStringEnum([
    "all",
    "upcoming",
    "active",
    "completed",
    "processing",
    "cancelled",
  ]).withDefault("all"),
  agentName: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),
};

export const loadMeetingsSearchParams = createLoader(MeetingsFilterServer);
