import { browser } from "wxt/browser";
import {
  emptyBasicProfile,
  type BasicProfile,
} from "../domain/profile";

const PROFILE_KEY = "global-profile-v1";

export async function loadBasicProfile(): Promise<BasicProfile> {
  const stored = await browser.storage.local.get(PROFILE_KEY);
  return { ...emptyBasicProfile, ...(stored[PROFILE_KEY] as Partial<BasicProfile>) };
}

export async function saveBasicProfile(profile: BasicProfile): Promise<void> {
  await browser.storage.local.set({ [PROFILE_KEY]: profile });
}
