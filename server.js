const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [];
let nextId = 1;

// ---------- helpers ----------
function validate(body) {
  const { title, author, year } = body || {};
  if (typeof title !== "string" || title.trim() === "") return false;
  if (typeof author !== "string" || author.trim() === "") return false;
  if (typeof year !== "number" || Number.isNaN(year)) return false;
  return true;
}

function titleExists(title, ignoreId = null) {
  return books.some(
    (b) => b.title.toLowerCase() === title.trim().toLowerCase() && b.id !== ignoreId
  );
}

// ---------- routes ----------

// POST /api/books
app.post("/api/books", (req, res) => {
  if (!validate(req.body)) {
    return res.status(400).json({ error: "title, author and year (number) are required" });
  }

  const { title, author, year } = req.body;

  if (titleExists(title)) {
    return res.status(409).json({ error: "Book with this title already exists" });
  }

  const book = { id: nextId++, title: title.trim(), author: author.trim(), year };
  books.push(book);
  res.status(201).json(book);
});

// GET /api/books
app.get("/api/books", (req, res) => {
  const { author } = req.query;

  if (author) {
    const filtered = books.filter(
      (b) => b.author.toLowerCase() === author.trim().toLowerCase()
    );
    return res.status(200).json(filtered);
  }

  res.status(200).json(books);
});

// GET /api/books/:id   <-- the route you asked about goes HERE
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json(book);
});

// PUT /api/books/:id
app.put("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  if (!validate(req.body)) {
    return res.status(400).json({ error: "title, author and year (number) are required" });
  }

  const { title, author, year } = req.body;

  if (titleExists(title, id)) {
    return res.status(409).json({ error: "Book with this title already exists" });
  }

  book.title = title.trim();
  book.author = author.trim();
  book.year = year;

  res.status(200).json(book);
});

// DELETE /api/books/:id
app.delete("/api/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const [deleted] = books.splice(index, 1);
  res.status(200).json(deleted);
});

// (PUT and DELETE will be added here next)

// ---------- start server (always last) ----------
app.listen(PORT, () => {
  console.log(`Books API running on http://localhost:${PORT}`);
});