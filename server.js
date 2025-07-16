const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const fileUpload = require("express-fileupload"); 
const connectDB = require("./config/connection");

dotenv.config();
const app = express();

app.use(helmet());

const corsOptions = {
    origin: "http://localhost:5173"
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' })); // ✅ File upload middleware

// Your routes
app.use("/api/products", require("./routes/product.routes"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectDB();
    console.log(`✅ Connected to port ${PORT}`);
});
