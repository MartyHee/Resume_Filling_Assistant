import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Resume Filling Assistant",
    description: "本地优先、由用户确认的网申资料填充助手",
    permissions: ["activeTab", "scripting", "storage", "sidePanel"],
    action: {
      default_title: "打开 Resume Filling Assistant",
    },
    optional_host_permissions: [
      "https://www.zhiyeapp.com/*",
      "https://beisen.zhiye.com/*",
    ],
  },
});
