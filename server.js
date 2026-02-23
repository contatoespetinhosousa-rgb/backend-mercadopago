import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 CONFIG NOVA DO MERCADO PAGO
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preference = new Preference(client);

// Criar pagamento
app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: "Pedido Espetinho",
          quantity: 1,
          unit_price: 10,
          currency_id: "BRL",
        },
      ],
    };

    const response = await preference.create({ body });

    res.json({
      id: response.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao criar pagamento");
  }
});

app.get("/", (req, res) => {
  res.send("Servidor Mercado Pago rodando 🚀");
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
