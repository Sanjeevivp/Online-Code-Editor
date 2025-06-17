const htmlEditor = document.getElementById('html');
const cssEditor = document.getElementById('css');
const jsEditor = document.getElementById('js');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('download');
const themeToggle = document.getElementById('themeToggle');
const tabs = document.querySelectorAll('.tab');
const editors = document.querySelectorAll('.editor');

// Load from localStorage on load
window.addEventListener('DOMContentLoaded', () => {
  htmlEditor.value = localStorage.getItem('code-html') || '';
  cssEditor.value = localStorage.getItem('code-css') || '';
  jsEditor.value = localStorage.getItem('code-js') || '';
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  runCode();
});

// Auto-run & auto-save on input
[htmlEditor, cssEditor, jsEditor].forEach((editor, idx) => {
  editor.addEventListener('input', () => {
    localStorage.setItem(`code-${editor.id}`, editor.value);
    runCode();
  });
});

// Run the code inside iframe
function runCode() {
  const html = htmlEditor.value;
  const css = `<style>${cssEditor.value}</style>`;
  const js = `<script>${jsEditor.value}<\/script>`;
  const doc = preview.contentDocument || preview.contentWindow.document;
  doc.open();
  doc.write(`${html}${css}${js}`);
  doc.close();
}

// Tab switch logic
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    editors.forEach(e => e.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Download code as HTML file
downloadBtn.addEventListener('click', () => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>${cssEditor.value}</style>
</head>
<body>
  ${htmlEditor.value}
  <script>${jsEditor.value}<\/script>
</body>
</html>
  `.trim();

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.download = 'your_code.html';
  link.href = URL.createObjectURL(blob);
  link.click();
});
