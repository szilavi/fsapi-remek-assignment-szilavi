require("dotenv").config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
const app = require("./server");

const createServer = require("./server");

const port = process.env.PORT;

//DATABASE CONNECTION

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    console.log("MongoDB connection has been established successfully")
  )
  .catch((err) => {
    console.log(err);
    process.exit();
  });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
