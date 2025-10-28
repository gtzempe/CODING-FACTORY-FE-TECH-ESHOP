const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./utils/swagger");
const cors = require("cors");

app.use(express.json());

const auth = require("./routes/auth.route");
const user = require("./routes/user.route");
const product = require("./routes/product.route");
const order = require("./routes/order.route");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://coding-factory-fe-tech-eshop-5h2g24tiw-tzempes-projects.vercel.app"],
    credentials: true,
  })
);



// app.use(
//   cors({
//     origin: "*",
//   })
// );

app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/products", product);
app.use("/api/orders", order);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument.options));

module.exports = app;
