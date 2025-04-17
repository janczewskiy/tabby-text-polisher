figma.showUI(__html__, { width: 600, height: 400 });

async function getImageBase64(node: SceneNode): Promise<string> {
  const bytes = await node.exportAsync({
    format: "PNG",
    constraint: { type: "WIDTH", value: node.width * 2 } // масштаб динамически
  });
  const base64 = figma.base64Encode(bytes);
  return base64;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'analyze') {
    const selection = figma.currentPage.selection;
    if (selection.length !== 1) {
      figma.ui.postMessage("❌ Please select one frame.");
      return;
    }

    const node = selection[0];
    const imageBase64 = await getImageBase64(node);

    figma.ui.postMessage("📤 Sending request to backend...");

    try {
      const response = await fetch("https://tabby-copy-polisher-server-tj3m.vercel.app/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64, token: "tabby_secret" })
      });

      const result = await response.json();
      figma.ui.postMessage(result);
    } catch (err) {
      figma.ui.postMessage("❌ Failed to reach backend.");
    }
  }
};