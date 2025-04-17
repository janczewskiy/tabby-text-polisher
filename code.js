figma.showUI(__html__, { width: 600, height: 400 });

async function getImageBase64(node) {
  const bytes = await node.exportAsync({ format: "PNG", scale: 2 });
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
    if (!["FRAME", "GROUP", "COMPONENT", "INSTANCE"].includes(node.type)) {
      figma.ui.postMessage("❌ Selected element is not exportable.");
      return;
    }

    try {
      const imageBase64 = await getImageBase64(node);

      figma.ui.postMessage("📤 Sending request to backend...");

      const response = await fetch("https://tabby-copy-polisher-server-tj3m.vercel.app/api/analyze", {
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
      figma.ui.postMessage(`❌ Error: ${error.message}`);
    }
  }
};
