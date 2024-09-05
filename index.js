const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("./config/database")();


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const apiV1 = require("./api/v1/routes/index.route");


apiV1(app);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

