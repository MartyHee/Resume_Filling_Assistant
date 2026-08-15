import { browser } from "wxt/browser";
import type { FillMatch, FillSummary, PageField } from "../filling/types";

type PageSnapshot = { url: string; fields: PageField[] };

async function activeTabId(): Promise<number> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id == null) throw new Error("找不到当前页面");
  return tab.id;
}

export async function scanActivePage(): Promise<PageSnapshot> {
  const tabId = await activeTabId();
  const [result] = await browser.scripting.executeScript({
    target: { tabId },
    func: () => {
      const controls = Array.from(
        document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
          "input, textarea, select",
        ),
      ).filter((control) => {
        const blocked = ["hidden", "password", "file", "submit", "button", "reset"];
        return !control.disabled && !blocked.includes(control.type.toLowerCase());
      });

      const fields = controls.map((control, index) => {
        const generatedId = `rfa-field-${index}`;
        control.dataset.rfaFieldId = generatedId;
        const explicitLabel = control.id
          ? document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(control.id)}"]`)
          : null;
        const wrappedLabel = control.closest("label");
        const nearbyLabel = control.parentElement?.querySelector("label");
        return {
          id: generatedId,
          label: (explicitLabel ?? wrappedLabel ?? nearbyLabel)?.textContent?.trim() ?? "",
          name: control.getAttribute("name") ?? "",
          placeholder: control.getAttribute("placeholder") ?? "",
          type: control.type,
          value: control.value,
        };
      });

      return { url: location.href, fields };
    },
  });

  if (!result?.result) throw new Error("无法读取当前页面，请先授权当前网站");
  return result.result;
}

export async function applyFillMatches(
  matches: FillMatch[],
  summary: Omit<FillSummary, "filled" | "failed">,
): Promise<FillSummary> {
  const tabId = await activeTabId();
  const [result] = await browser.scripting.executeScript({
    target: { tabId },
    args: [matches],
    func: (pageMatches) => {
      const undo = new Map<string, string>();
      let filled = 0;
      let failed = 0;

      for (const match of pageMatches) {
        const control = document.querySelector<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >(`[data-rfa-field-id="${CSS.escape(match.pageFieldId)}"]`);
        if (!control || control.value.trim() !== "") {
          failed += 1;
          continue;
        }
        undo.set(match.pageFieldId, control.value);
        control.value = match.value;
        control.dispatchEvent(new Event("input", { bubbles: true }));
        control.dispatchEvent(new Event("change", { bubbles: true }));
        filled += 1;
      }

      (window as typeof window & { __rfaUndo?: Array<[string, string]> }).__rfaUndo = [
        ...undo.entries(),
      ];
      return { filled, failed };
    },
  });

  return { ...summary, ...(result?.result ?? { filled: 0, failed: matches.length }) };
}

export async function undoLatestFill(): Promise<number> {
  const tabId = await activeTabId();
  const [result] = await browser.scripting.executeScript({
    target: { tabId },
    func: () => {
      const pageWindow = window as typeof window & { __rfaUndo?: Array<[string, string]> };
      const undo = pageWindow.__rfaUndo ?? [];
      let restored = 0;
      for (const [id, value] of undo) {
        const control = document.querySelector<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >(`[data-rfa-field-id="${CSS.escape(id)}"]`);
        if (!control) continue;
        control.value = value;
        control.dispatchEvent(new Event("input", { bubbles: true }));
        control.dispatchEvent(new Event("change", { bubbles: true }));
        restored += 1;
      }
      pageWindow.__rfaUndo = [];
      return restored;
    },
  });
  return result?.result ?? 0;
}
