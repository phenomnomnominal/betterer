async function main() {
  const response = await fetch('/betterer/corner/corner.html');
  const text = await response.text();
  document.body.appendChild(text);
}
main();
