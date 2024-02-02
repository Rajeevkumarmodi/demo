const express = require("express");
const mariadb = require("mariadb");

const app = express();
const PORT = 8080;

app.use(express.json());

// database connection
const pool = mariadb.createPool({
  host: "127.0.0.1",
  port: "3307",
  user: "root",
  password: "rajeev123",
  database: "pos_system",
});

app.get("/", (req, res) => {
  res.send("hello ");
});

// user register
app.post("/user/register", async (req, res) => {
  const { formData } = req.body;
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    address,
    country,
    postalZipCode,
    companyName,
    publishStatus,
    bankDetail,
  } = formData;

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !email ||
    !password ||
    !address ||
    !country ||
    !postalZipCode ||
    !companyName ||
    !publishStatus ||
    !bankDetail
  ) {
    return res
      .status(404)
      .json({ success: false, message: "all fields are required" });
  }

  let connect;
  try {
    connect = await pool.getConnection();
    const result = await connect.query(
      "INSERT INTO user (firstName, lastName, phone,email,password,address,postalZipCode,companyName,publishStatus,bankDetail) VALUES (?, ?,?,?,?,?,?,?,?,?)",
      [
        firstName,
        lastName,
        phone,
        email,
        password,
        address,
        postalZipCode,
        companyName,
        publishStatus,
        bankDetail,
      ]
    );

    res
      .status(201)
      .json({ success: true, message: "user data added", data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// listen
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
