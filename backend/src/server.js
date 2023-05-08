const { join } = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const logger = require("./config/logger");

const authenticateJWT = require("./auth/authenticate");

const authHandler = require("./auth/authHandler");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");

const corsConfig = {
  origin: "http://localhost:4200",
  methods: ["POST", "PUT", "GET", "CREATE", "DELETE"],
};

const angularPath = join(__dirname, "..", "public", "angular");
const app = express();
const apiWrapper = express();
apiWrapper.use("/api", app);
apiWrapper.use("/", express.static(angularPath));

app.use(cors(corsConfig));
app.use(
  morgan("combined", { stream: { write: (message) => logger.info(message) } })
);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/login", authHandler.login);
app.post("/refresh", authHandler.refresh);
app.post("/logout", authHandler.logout);
app.get("/me", authHandler.me);

app.use("/store", require("./controllers/product/product.routes"));
app.use("/user", require("./controllers/user/user.routes"));
app.use(
  "/wishlist",
  authenticateJWT,
  require("./controllers/wishlist/wishlist.routes")
);

apiWrapper.get("*", (req, res) => {
  res.sendFile(join(angularPath, "index.html"));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({
    hasError: true,
    message: err.message,
  });
});

module.exports = apiWrapper;
