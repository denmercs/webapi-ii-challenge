const express = require("express");
const router = express.Router();
const Data = require("./data/db");

// GET ALL DATA
router.get("/", (req, res) => {
  Data.find()
    .then(posts => res.status(200).json(posts))
    .catch(err =>
      res.status(500).json({ err: "posts information could not be retrieved" })
    );
});

// ADD POST
router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({ error: "Requires title and contents" });
  }

  Data.insert({ title, contents }).then(({ id }) => {
    Data.findById(id)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res.status(500).json({ error: "server error retrieving user" });
      });
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Data.findById(id)
    .then(post => {
      console.log("post", post);
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(400)
          .json({ error: "The post with the specified ID does not exist" });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ error: "Require some changes, need title or contents" });
  }

  Data.update(id, { title, contents })
    .then(updated => {
      if (updated) {
        Data.findById(id)
          .then(user => res.status(200).json(user))
          .catch(err =>
            res.status(500).json({ error: "User ID can't be found" })
          );
      } else {
        res.status(400).json({ error: `User ${id} cannot be found` });
      }
    })
    .catch(err => {
      res.status(500).json(err => {
        error: "Error updating the user";
      });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Data.remove(id)
    .then(deleted => {
      console.log("deleted");
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "User with ID does not exist" });
      }
    })
    .catch(err => {
      console.log("error");
      res.status(500).json({ err: "server not detecting" });
    });
});

module.exports = router;
