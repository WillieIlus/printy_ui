function stripHtmlToText(html) {
  if (html == null || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
function hasRichTextContent(html) {
  return stripHtmlToText(html ?? "").length > 0;
}

export { hasRichTextContent as h, stripHtmlToText as s };
//# sourceMappingURL=richText-DycefbI5.mjs.map
