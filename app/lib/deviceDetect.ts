import { UAParser } from "ua-parser-js";

export function getDeviceInfo() {
  const parser = new UAParser();
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown";
  const os = result.os.name || "Unknown";

  let deviceType = "desktop";
  if (result.device.type === "mobile") deviceType = "mobile";
  else if (result.device.type === "tablet") deviceType = "tablet";

  return { browser, os, deviceType };
}