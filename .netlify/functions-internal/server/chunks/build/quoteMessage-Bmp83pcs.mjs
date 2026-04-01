function getWhatsAppShareUrl(message, phone) {
  const encoded = encodeURIComponent(message);
  const base = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "https://wa.me/";
  return `${base}?text=${encoded}`;
}

export { getWhatsAppShareUrl as g };
//# sourceMappingURL=quoteMessage-Bmp83pcs.mjs.map
