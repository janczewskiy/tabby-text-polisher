figma.showUI(__html__, { width: 600, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "analyze") {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1 || selection[0].type !== "FRAME") {
      figma.ui.postMessage({ type: "result", result: "❌ Please select a single Frame." });
      return;
    }

    try {
      const imageBytes = await selection[0].exportAsync({ format: "PNG" });
      const base64 = figma.base64Encode(imageBytes);

      const response = await fetch("https://tabby-copy-polisher-server-tj3m.vercel.app/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          token: "tabby_secret"
        })
      });

      const data = await response.json();
      console.log("✅ Response from server:", data); // 👈 Журналим ответ

      const resultText = data?.result || "❌ No result.";
      figma.ui.postMessage({ type: "result", result: resultText });

    } catch (err) {
      console.error("🚨 Error during fetch/export:", err);
      figma.ui.postMessage({ type: "result", result: "❌ Failed to fetch or export." });
    }
  }
};
