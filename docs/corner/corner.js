async function main() {
  const response = await fetch('/betterer/corner/corner.html');
  const text = await response.text();
  
  const template = document.createElement('template');
  template.innerHTML = text.trim();
  
  document.body.appendChild(template.content.firstChild);
}
main();
