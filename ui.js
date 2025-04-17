document.getElementById('polish-btn').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'request-polish' } }, '*');
};

onmessage = (event) => {
  const { result, error, loading } = event.data.pluginMessage;
  const status = document.getElementById('status');
  const output = document.getElementById('output');

  if (loading) {
    status.textContent = 'Processing your request...';
    output.textContent = '';
  } else if (error) {
    status.textContent = 'Error:';
    output.textContent = error;
  } else if (result) {
    status.textContent = 'Result:';
    output.textContent = result;
  }
};
