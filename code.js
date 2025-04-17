figma.showUI(__html__, { width: 600, height: 400 });

async function getImageBase64(node) {
  const bytes = await node.exportAsync({ format: "PNG" }); // без scale
  return figma.base64Encode(bytes);
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "analyze") {
    const selection = figma.currentPage.selection;
    if (selection.length !== 1) {
      figma.ui.postMessage("❌ Please select one frame.");
      return;
    }

    const node = selection[0];
    const imageBase64 = await getImageBase64(node);

    try {
      const response = await fetch("https://tabby-copy-polisher-server-tj3m.vercel.app/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64, token: "tabby_secret" })
      });

      const result = await response.text();
      figma.ui.postMessage(result || "❌ No useful text found.");
    } catch (e) {
      console.error(e);
      figma.ui.postMessage("❌ Failed to fetch.");
    }
  }
};