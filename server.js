const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: "COLE_AQUI_SEU_ACCESS_TOKEN_TESTE"
});

app.post("/criar-pagamento", async (req, res) => {
  try {
    const { items, deliveryFee } = req.body;

    const preference = {
      items: items.map(item => ({
        title: item.nome,
        quantity: item.quantidade,
        unit_price: item.preco,
        currency_id: "BRL"
      })),
      shipments: {
        cost: deliveryFee,
        mode: "not_specified"
      }
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ linkPagamento: response.body.init_point });

  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao criar pagamento");
  }
});

app.get("/", (req,res)=>{
  res.send("Servidor Mercado Pago funcionando!");
});

app.listen(3000, () => console.log("Servidor rodando"));
