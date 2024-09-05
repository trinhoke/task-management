const express = require("express");
require("./config/database")();


const app = express();

app.use(cors());

const apiV1 = require("./api/v1/routes/index.route");

app.use(express.json());

apiV1(app);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

