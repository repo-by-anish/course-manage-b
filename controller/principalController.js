const Principal = require("../models/Principal");
const bcrypt = require('bcrypt');

const getAllPrincipals = async (req, res) => {
  const principals = await Principal.find().lean().exec();
  if (!principals.length) {
    return res.status(400).json({ message: "No principal found" });
  }
  res.json(principals);
};

const createPrincipal = async (req, res) => {
  const { firstName, lastName, email, password, department } = req.body;

  if (!firstName || !lastName || !email || !password || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
  const principal = await Principal.create({
    firstName,
    lastName,
    email,
    password:hashedPwd,
    department,
  });

  if (principal) {
    return res.status(201).json({ message: "Principal created successfully" });
  } else {
    return res.status(400).json({ message: "Invalid principal data received" });
  }
};

const deletePrincipal = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Id is not provided" });
  }

  const principal = await Principal.findById(id);
  if (!principal) {
    return res.status(404).json({ message: "Principal not found" });
  }

  await principal.deleteOne();
  return res.status(200).json({ message: "Principal deleted successfully" });
};

module.exports = {
  getAllPrincipals,
  createPrincipal,
  deletePrincipal,
};
