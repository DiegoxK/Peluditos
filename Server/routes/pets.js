import express from "express";
const router = express.Router();

import Pet from "../models/pet";

// ======================================================================
// pets

//pet-GET
router.get("/pet", async (req, res) => {
  try {
    const data = await Pet.find();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error,
    });
  }
});

//GET-by-ID
router.get("/pet/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const pet = await Pet.findById(_id);
    res.json(pet);
  } catch (error) {
    return res.status(400).json({
      messagee: "Error",
      id: _id,
      error,
    });
  }
});

// Delete
router.delete("/pet/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const pet = await Pet.findByIdAndDelete({ _id });
    if (!pet) {
      return res.status(400).json({
        message: "No id find",
        error,
      });
    }
    res.json(pet);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error",
      error,
    });
  }
});

//pet-POST
router.post("/pet", async (req, res) => {
  const body = req.body;
  try {
    await Pet.create(body);
    res.status(200).json({ message: "Register Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      body: body,
      error,
    });
  }
});

//pet-PUT
router.put("/pet/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const pet = await Pet.findByIdAndUpdate(_id, body, { new: true });
    res.json(pet);
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
});

module.exports = router;
