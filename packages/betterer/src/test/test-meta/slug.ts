export function encodeSlug(name: string): string {
  const encoded = encodeURIComponent(name).replace(/\*/g, '%2A');
  if (/^\.+$/.test(encoded) || encoded.endsWith('.')) {
    return encoded.replace(/\./g, '%2E');
  }
  return encoded;
}

export function decodeSlug(slug: string): string {
  return decodeURIComponent(slug);
}
