figma.showUI(__html__, { width: 600, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "analyze") {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1 || selection[0].type !== "FRAME") {
      figma.ui.postMessage({ type: "result", result: "❌ Please select a single frame." });
      return;
    }

    try {
      const image = await selection[0].exportAsync({ format: "PNG" });
      const base64 = figma.base64Encode(image);

      const response = await fetch("https://tabby-copy-polisher-server-tj3m.vercel.app/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          token: "tabby_secret"
        })
      });

      const result = await response.json();
      figma.ui.postMessage({ type: "result", result: result?.result || "❌ No result." });

    } catch (error) {
      console.error("Export or fetch failed:", error);
      figma.ui.postMessage({ type: "result", result: "❌ Error during export or fetch." });
    }
  }
};
