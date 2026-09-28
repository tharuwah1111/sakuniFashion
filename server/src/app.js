const express = require("express");

const routes = require("./routes/routes");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(5000, () => {
    console.log("Backend is working");
})