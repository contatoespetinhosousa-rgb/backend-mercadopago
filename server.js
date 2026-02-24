import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();

// ✅ CORS (permite seu site do GitHub Pages chamar o backend)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preference = new Preference(client);

// ✅ Rota de saúde (teste no navegador)
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, service: "backend-mercadopago" });
});

// ✅ Ping simples (teste no navegador)
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// ✅ Criar preferência (AQUI vai o valor certo do pedido)
app.post("/create_preference", async (req, res) => {
  try {
    const { items, payer, back_urls, external_reference, deliveryFee } = req.body || {};
    // ✅ validações básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items inválidos ou vazios." });
    }
// 👉 cria lista de itens que vieram do site
const itemsList = items.map((it) => ({
  title: String(it.title || it.name || "Item"),
  quantity: Number(it.quantity || 1),
  unit_price: Number(it.unit_price || 0),
  currency_id: "BRL",
}));

// 👉 adiciona taxa de entrega como item do Mercado Pago
const fee = Number(deliveryFee || 0);
if (fee > 0) {
  itemsList.push({
    title: "Taxa de entrega",
    quantity: 1,
    unit_price: fee,
    currency_id: "BRL",
  });
}
    // ✅ monta body da preferência com os itens que vieram do site (total real)
    const body = {
    items: itemsList,   
      // (opcional) dados do cliente
      payer: payer || undefined,

      // (opcional) URLs de retorno
    back_urls: {
  success: "https://espetinhosousa-rgb.github.io/",
  failure: "https://espetinhosousa-rgb.github.io/",
  pending: "https://espetinhosousa-rgb.github.io/"
},
auto_return: "approved",
      // (opcional) para identificar o pedido
      external_reference: external_reference || undefined,
    };

    const response = await preference.create({ body });

    // ✅ devolve o link de pagamento certo pro site redirecionar
    return res.status(200).json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error) {
    console.error("Erro Mercado Pago:", error);
    return res.status(500).json({
      error: "Erro ao criar preferência",
      details: String(error?.message || error),
    });
  }
});

// ✅ Porta (Render usa process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
