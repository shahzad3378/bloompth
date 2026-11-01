export const services = [
  "Product sourcing",
  "Wholesale & liquidation",
  "Warehousing & fulfillment",
] as const;
export function serviceAnswer(message: string) {
  const text = message.toLowerCase();
  if (/price|cost|rate|quote|charge|fee/.test(text))
    return {
      text: "Quotes depend on your product, quantity, destination and service. Share these details here or use Get a quote. Our team will confirm availability and pricing; no purchase is made in this chat.",
      handoff: true,
    };
  if (/sourc|custom|manufactur|supplier/.test(text))
    return {
      text: "We help source products worldwide for personal use, wholesale and online businesses. Tell us what you need, your quantity and destination country. Our team confirms supplier availability, product cost and shipping before you proceed.",
      handoff: false,
    };
  if (/warehouse|fulfill|storage|pack|cod|deliver/.test(text))
    return {
      text: "BloomPath coordinates storage, pick & pack and delivery support in the UAE and Canada. Share the stock location, product type, destination and expected monthly orders. Carrier coverage, COD availability and charges are confirmed in your quote.",
      handoff: false,
    };
  if (/wholesale|liquidation|stock|bulk/.test(text))
    return {
      text: "Ask us about wholesale and liquidation sourcing from the USA, Canada and UAE. Stock changes, so please share the category, quantity and destination. Our team will confirm what is available and its condition before quoting.",
      handoff: false,
    };
  if (/hello|hi\b|hey|salam/.test(text))
    return {
      text: "Hello! I am BloomPath’s automated service guide. I can help with sourcing, wholesale stock or fulfillment. What would you like help with? You do not need to share a phone number.",
      handoff: false,
    };
  return {
    text: "I have passed your question to our team. Replies appear in this chat when a teammate responds. You can leave an email for follow-up, but it is optional. Please share the product or service, quantity and country so the team can help.",
    handoff: true,
  };
}
