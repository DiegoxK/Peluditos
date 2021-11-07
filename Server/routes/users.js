import express from "express";
const router = express.Router();

import User from "../models/user";

// ======================================================================
// Users

//User-GET
router.get("/user", async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error,
    });
  }
});

//GET-by-ID
router.get("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    res.json(user);
  } catch (error) {
    return res.status(400).json({
      messagee: "Error",
      id: _id,
      error,
    });
  }
});

// Delete
router.delete("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete({ _id });
    if (!user) {
      return res.status(400).json({
        message: "No id find",
        error,
      });
    }
    res.json(user);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error",
      error,
    });
  }
});

//User-POST
router.post("/user", async (req, res) => {
  const body = req.body;
  try {
    await User.create(body);
    res.status(200).json({ message: "Register Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      body: body,
      error,
    });
  }
});

//User-PUT
router.put("/user/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id, body, { new: true });
    res.json(user);
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
});

module.exports = router;
