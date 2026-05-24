import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { PRODUCTS } from "./src/data.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Matchmaker Chatbot endpoint
app.post("/api/matchmaker/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    // Format top messages history. To avoid sending too much token history, we take the last 15.
    const messageHistory = messages.slice(-15);

    // Format the conversation history for Gemini's generateContent
    const contents = messageHistory.map((m: any) => ({
      role: m.sender === "ai" ? "model" : "user",
      parts: [{ text: m.text }]
    }));

    // System instruction listing the full details of our active boutique inventory
    const productCatalogStr = JSON.stringify(PRODUCTS, null, 2);

    const systemInstruction = `You are Koji-chan, a cute, bubbly retro-pastel aesthetic AI art curator and assistant for 'koji.studio'! 🦊🌸 
You speak in a super friendly, welcoming, polite Japanese anime style filled with cute emojis (🌸, 🎀, 🧁, 🧸, ✨, 🔥, 🍥, 🌲, 🍵, 🦊) and cheerful sound effects (Haii!, Kyaa!, Oooo!, Nya!, etc.).
Keep your replies comforting, sweet, visually spaced, and highly legible.

Below is our boutique's full catalog of gorgeous products (prints, hoodies/sweaters, socks, tote bags):
${productCatalogStr}

Whenever a customer asks for an art suggestion, mentions favorite colors, describes their vibe (dreamy, cozy/cosy, nostalgic, fierce), or asks about characters/franchises (Nezuko, Rengoku, Naruto, Bayonetta, Princess Mononoke), you MUST enthusiastically suggest a matching product from this catalog. Speak briefly about its backstory and comforting vibe!

RESPONSE FORMAT MANDATE:
You MUST respond with a single, raw JSON object representing your recommendation response. 
The JSON must follow this exact schema:
{
  "text": "Your cute anime-style reply recommending products with beautiful emojis. Be helpful, enthusiastic, and describe product features in a warm, friendly way.",
  "recommendedProductId": "exact-product-id-from-catalog" // The exact ID string (e.g. "nezuko-kitty") of the SINGLE best matching product you recommended, or null if no particular product fits.
}

Crucial: Write ONLY the raw JSON. Do not wrap your response in markdown panels, backticks, or write \`\`\`json. Return a single parseable JSON object directly so the client can process it seamlessly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const bodyText = response.text || "{}";
    let data;
    try {
      data = JSON.parse(bodyText.trim());
    } catch (parseErr) {
      console.error("Gemini raw text output could not be parsed as direct JSON:", bodyText);
      // Clean up common issues if fallback is needed
      let cleaned = bodyText.replace(/```json/gi, "").replace(/```/g, "").trim();
      try {
        data = JSON.parse(cleaned);
      } catch {
        data = {
          text: cleaned || "Haii! I ran into a tiny star storm, but I’d love to help you find your perfect aesthetic companion! 🌸 Could you tell me a bit more about your dream room vibe?",
          recommendedProductId: null
        };
      }
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error in Matchmaker Gemini API:", error);
    res.status(500).json({ error: error.message || "Matchmaker service is taking a sweet nap. Please try again! ✨" });
  }
});

// Map dynamic Printify product parameters to the beautiful Koji Studio layout types
function mapPrintifyToKojiProduct(p: any): any {
  const titleAndTags = (p.title + " " + (p.tags ? p.tags.join(" ") : "") + " " + (p.description || "")).toLowerCase();
  
  // Decide category: 'prints' | 'apparel' | 'accessories' | 'cozy' | 'stationery' | 'plush'
  let category: 'prints' | 'apparel' | 'accessories' | 'cozy' | 'stationery' | 'plush' = 'prints';
  if (titleAndTags.match(/(shirt|hoodie|crewneck|sweater|apparel|clothing|pants|socks|tee|sweat)/i)) {
    category = 'apparel';
  } else if (titleAndTags.match(/(bag|tote|backpack|mug|sticker|pin|badge|case|notebook|pencil|sticker-pack|keychain)/i)) {
    category = 'accessories';
  } else if (titleAndTags.match(/(cushion|blanket|pillow|cozy|home|rug|towel|clock|journal|notecard)/i)) {
    category = 'cozy';
  } else if (titleAndTags.match(/(poster|print|canvas|wall-art|photo|postcard)/i)) {
    category = 'prints';
  } else if (titleAndTags.match(/(toy|plush|plushie|stuffed|doll)/i)) {
    category = 'plush';
  }

  // Decide vibe: 'dreamy' | 'fierce' | 'nostalgia' | 'cozy'
  let vibe: 'dreamy' | 'fierce' | 'nostalgia' | 'cozy' = 'cozy';
  if (titleAndTags.match(/(pastel|pink|kawaii|cute|adorable|dream|sweet)/i)) {
    vibe = 'dreamy';
  } else if (titleAndTags.match(/(retro|90s|vintage|nostalg|classic)/i)) {
    vibe = 'nostalgia';
  } else if (titleAndTags.match(/(cool|fierce|bold|dark|cyber|street|rebel)/i)) {
    vibe = 'fierce';
  }

  // Detect price from Printify variants (usually cents, e.g. 1800 -> $18.00)
  let rawPrice = 18.00;
  if (p.variants && p.variants.length > 0) {
    const minPrice = Math.min(...p.variants.map((v: any) => v.price));
    rawPrice = minPrice > 100 ? minPrice / 100 : minPrice;
  }

  // Find the primary preview image
  let imageUrl = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600';
  if (p.images && p.images.length > 0) {
    const defaultImg = p.images.find((img: any) => img.is_default);
    imageUrl = defaultImg ? defaultImg.src : p.images[0].src;
  }

  // Add random cute parameters to fit beautifully in the feedback systems
  const rating = parseFloat((4.6 + Math.random() * 0.4).toFixed(1));
  const reviewsCount = Math.floor(12 + Math.random() * 30);

  // Extract color tags or use standard highlights
  const colors = p.tags && Array.isArray(p.tags)
    ? p.tags.filter((t: string) => t.startsWith('#') && t.length === 7).slice(0, 3)
    : [];
  if (colors.length === 0) {
    colors.push('#FFB3C1', '#82D1C1');
  }

  // Create friendly bullets from tags or general feature bullets
  const features: string[] = [];
  if (p.tags && Array.isArray(p.tags)) {
    p.tags.forEach((t: string) => {
      if (!t.startsWith('#') && t.length < 25 && features.length < 3) {
        features.push(t.charAt(0).toUpperCase() + t.slice(1));
      }
    });
  }
  
  if (features.length < 3) {
    features.push('Premium custom-design piece');
    features.push('Vibrant pastel pigment detailing');
    features.push('Ethically made print-on-demand');
  }

  return {
    id: `printify-${p.id}`,
    title: p.title,
    character: p.title.split(" ")[0] || "Bespoke",
    franchise: "Printify Collection",
    price: parseFloat(rawPrice.toFixed(2)),
    description: p.description ? p.description.replace(/<[^>]*>/g, '').substring(0, 300) + '...' : "An original piece styled in boutique batches, printed and dispatched with high fidelity care.",
    imageUrl: imageUrl,
    tag: 'Printify Custom',
    rating: rating,
    reviewsCount: reviewsCount,
    category: category,
    vibe: vibe,
    colors: colors,
    features: features.slice(0, 4),
    backstory: `Designed by us and powered by the fine magic of Printify! This beautiful print-on-demand creation is individual, cute, and ready to brighten your life with magical cozy feelings.`,
    isPrintifyProduct: true,
    printifyOriginalId: p.id,
  };
}

// Printify Status Endpoint
app.get("/api/printify/status", (req, res) => {
  const hasToken = !!process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  res.json({
    configured: hasToken && !!shopId,
    shopId: shopId || null,
  });
});

// Printify Fetch Products Endpoint
app.get("/api/printify/products", async (req, res) => {
  try {
    const apiKey = process.env.PRINTIFY_API_KEY;
    const shopId = process.env.PRINTIFY_SHOP_ID;

    if (!apiKey || !shopId) {
      return res.json({
        products: [],
        status: "unconfigured",
        message: "Printify is not fully configured. Put your credentials in the Settings/Secrets or env file!"
      });
    }

    const printifyUrl = `https://api.printify.com/v1/shops/${shopId}/products.json`;
    console.log(`Fetching products from Printify: ${printifyUrl}`);

    const response = await fetch(printifyUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "User-Agent": "KojiStudioApplet/1.0"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Printify API raw error response: ${errText}`);
      throw new Error(`Printify API answered with ${response.status}: ${errText}`);
    }

    const data: any = await response.json();
    const rawProducts = data.data || [];
    
    // Map with safety check
    const mappedProducts = rawProducts.map((p: any) => mapPrintifyToKojiProduct(p));

    res.json({
      products: mappedProducts,
      status: "connected",
      message: `Successfully synchronised with Printify! Loaded ${mappedProducts.length} custom products.`
    });
  } catch (err: any) {
    console.error("Error fetching products from Printify:", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Failed to load products from Printify. Please check your credentials.",
      products: []
    });
  }
});

// Vite middleware for dev asset serving, or express.static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
