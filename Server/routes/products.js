import express from "express";
const router = express.Router();

import Products from "../models/products";

// ======================================================================
// Products

//Products-GET
router.get("/products", async (req, res) => {
  try {
    const data = await Products.find();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error,
    });
  }
});

//GET-by-ID
router.get("/products/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const products = await Products.findById(_id);
    res.json(products);
  } catch (error) {
    return res.status(500).json({
      messagee: "Error",
      id: _id,
      error,
    });
  }
});

// Delete
router.delete("/products/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const products = await Products.findByIdAndDelete({ _id });
    if (products) {
      return res.status(404).json({
        message: "Id no encontrado",
        error,
      });
    }
    res.json(products);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error",
      error,
    });
  }
});

//Products-POST
router.post("/products", async (req, res) => {
  const body = req.body;
  try {
    await Products.create(body);
    res.status(200).json({ message: "Registro Exitoso" });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      body: body,
      error,
    });
  }
});

//Products-PUT
router.put("/products/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const products = await Products.findByIdAndUpdate(_id, body, { new: true });
    res.json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error,
    });
  }
});

module.exports = router;
