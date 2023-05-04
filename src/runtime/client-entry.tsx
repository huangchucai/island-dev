// 浏览器端入口文件-渲染主题组件
import { createRoot } from "react-dom/client";
import { App } from "./App";

function renderInBrowser() {
  const containerEl = document.getElementById("root");
  if (!containerEl) {
    throw new Error("container element not found");
  }
  createRoot(containerEl).render(<App />);
}

renderInBrowser();
