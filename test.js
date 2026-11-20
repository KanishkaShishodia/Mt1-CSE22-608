const BASE = "http://localhost:3000/api/books";

async function test(label, method, path, body, expected) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(BASE + path, options);
  const data = await res.json();
  const result = res.status === expected ? "PASS" : "FAIL";

  console.log(`${result}  ${label}  (got ${res.status}, expected ${expected})`);
  console.log("      ", JSON.stringify(data));
}

async function run() {
  await test("POST valid book", "POST", "", { title: "Clean Code", author: "Robert", year: 2008 }, 201);
  await test("POST duplicate title", "POST", "", { title: "Clean Code", author: "Robert", year: 2008 }, 409);
  await test("POST missing data", "POST", "", { title: "X" }, 400);
  await test("POST second book", "POST", "", { title: "Refactoring", author: "Martin", year: 1999 }, 201);
  await test("GET all", "GET", "", null, 200);
  await test("GET filter by author", "GET", "?author=Robert", null, 200);
  await test("GET by id", "GET", "/1", null, 200);
  await test("GET wrong id", "GET", "/99", null, 404);
  await test("PUT valid", "PUT", "/1", { title: "Clean Code 2", author: "Robert", year: 2020 }, 200);
  await test("PUT duplicate title", "PUT", "/1", { title: "Refactoring", author: "Robert", year: 2020 }, 409);
  await test("PUT wrong id", "PUT", "/99", { title: "A", author: "B", year: 2000 }, 404);
  await test("PUT missing data", "PUT", "/1", { title: "X" }, 400);
  await test("DELETE valid", "DELETE", "/1", null, 200);
  await test("DELETE wrong id", "DELETE", "/1", null, 404);
}

run().catch((err) => console.log("Error: is the server running?", err.message));