import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

app.post("/create_preference", async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: "Pedido Espetinho",
          quantity: 1,
          unit_price: 10,
        },
      ],
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      id: response.body.id,
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
