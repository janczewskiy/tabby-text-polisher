async function getImageBase64(node) {
  const imageBytes = await node.exportAsync({ format: "PNG" });
  return figma.base64Encode(imageBytes);
}

figma.showUI(__html__, { width: 720, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "analyze") {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1 || selection[0].type !== "FRAME") {
      figma.ui.postMessage({ type: "result", result: "❌ Please select one frame." });
      return;
    }

    const node = selection[0];
    const base64 = await getImageBase64(node);

    const response = await fetch("https://tabby-copy-polisher-server-tj3m.vercel.app/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: base64,
        token: "tabby_secret"
      })
    });

    const result = await response.json();
    figma.ui.postMessage({ type: "result", result: result?.result || "❌ No result." });
  }
};
