figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = async msg => {
  if (msg.type === 'request-polish') {
    const selection = figma.currentPage.selection[0];

    if (!selection) {
      figma.ui.postMessage({ error: "Please select an object containing text or an image." });
      return;
    }

    if (selection.type === 'TEXT') {
      const content = selection.characters;
      figma.ui.postMessage({ loading: true });
      const response = await fetch('https://tabby-copy-polisher-server.vercel.app/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      const result = await response.json();
      figma.ui.postMessage({ result: result.result });
    } else {
      figma.ui.postMessage({ error: "Please select a text object." });
    }
  }
};
