figma.showUI(__html__, { width: 800, height: 800 });

async function getImageBase64(node) {
  await node.exportAsync({ format: 'PNG', scale: 2 });
  return figma.base64Encode(bytes);
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
    figma.ui.postMessage("Sending request to backend...");

    try {
      const response = await fetch("https://tabby-copy-polisher-server-tj3m.vercel.app/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64, token: "tabby_secret" })
      });

      const result = await response.text();
      figma.ui.postMessage(result);
    } catch (err) {
      figma.ui.postMessage("❌ Failed to reach backend.\n" + err.message);
    }
  }
};
