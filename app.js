const express = require("express");

const fs = require("fs");

const app = express();

const path = require("path");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      return console.log(err);
    }
    res.render("index", { files });
  });
});

app.get("/show/:filename", (req, res) => {
  const filename = req.params.filename;

  fs.readFile(`./files/${filename}.txt`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("File not found");
    }

    const lines = data.split("\n");
    const title = lines[0].replace("Title: ", "").trim();
    const description = lines[1].replace("Description: ", "").trim();

    res.render("show", { filename, title, description });
  });
});

app.get("/create", (req, res) => {
  res.render("createkhatabook");
});

app.post("/create", (req, res) => {
  let currentDate = new Date();
  let formattedDate = currentDate
    .toLocaleDateString("en-GB")
    .split("/")
    .join("-");

  fs.appendFile(
    `./files/${formattedDate}.txt`,
    `Title: ${req.body.title}\n`,
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );

  fs.appendFile(
    `./files/${formattedDate}.txt`,
    `Description: ${req.body.description}\n`,
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );

  res.redirect("/");
});

app.get("/edit/:filename", (req, res) => {
  const filename = req.params.filename;

  fs.readFile(`./files/${filename}.txt`, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.render("edit", { filename, content: data });
  });
});

app.post("/edit/:filename", (req, res) => {
  const filename = req.params.filename;
  const newContent = req.body.description;

  fs.writeFile(`./files/${filename}.txt`, newContent, (err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/delete/:filename", (req, res) => {
  const filename = req.params.filename;

  fs.unlink(`./files/${filename}.txt`, (err) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error deleting file');
      }
      res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
