import { browser } from "wxt/browser";

export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.id == null) return;
    await browser.sidePanel.open({ tabId: tab.id });
  });
});
