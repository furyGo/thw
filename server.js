const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

const PRIVATE_KEY = fs.readFileSync("./keys/rsa.key", "utf8");
const jwks = require("./jwks.json");

const users = [
  { id: 1, email: "user@example.com", password: "password123" },
];

app.use(express.json());

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (u) => u.email === email && u.password === password,
  );
  if (!user) return res.status(401).send({ message: "Invalid credentials" });

  const payload = {
    iss: "https://thw.phper.fun",
    sub: "32e2632a-f98a-4859-86cb-c735a375198f",
    aud: "MossDrive",
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const token = jwt.sign(payload, PRIVATE_KEY, {
    algorithm: "RS256",
    keyid: "0",
  });

  res.send({ token });
});

app.get("/.well-known/jwks.json", (req, res) => {
  res.json(jwks);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
