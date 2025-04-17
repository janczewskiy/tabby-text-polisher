figma.showUI(__html__, { width: 600, height: 400 });

async function getImageBase64(node) {
  const bytes = await node.exportAsync({ format: "PNG" });
  return figma.base64Encode(bytes);
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'analyze') {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1 || selection[0].type !== 'FRAME') {
      figma.ui.postMessage("❌ Please select exactly one frame.");
      return;
    }

    const node = selection[0];
    const imageBase64 = await getImageBase64(node);

    try {
      const response = await fetch("https://tabby-copy-polisher-server-tj3m.vercel.app/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          token: "tabby_secret"
        })
      });

      const result = await response.text();
      figma.ui.postMessage(result);
    } catch (error) {
      figma.ui.postMessage("❌ Failed to reach backend.");
    }
  }
};
