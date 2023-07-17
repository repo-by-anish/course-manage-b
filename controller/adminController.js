const Admin = require("../models/Admin");
const bcrypt = require('bcrypt');

const createAdmin = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await Admin.findOne({ username });
    if (duplicate) {
        return res.status(409).json({ message: "Username already in use" });
    }

    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const admin = await Admin.create({
        username,
        password: hashedPwd,
    });

    if (admin) {
        return res.status(201).json({ message: "Admin created" });
    } else {
        return res.status(400).json({ message: "Invalid admin data received" });
    }
};

const updateAdmin = async (req, res) => {
    const { id, username, password } = req.body;
    if (!id || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const admin = await Admin.findById(id);
    if (!admin) {
        return res.status(400).json({ message: "Admin not found" });
    }
    const duplicate = await Admin.findOne({ username }).lean().exec();
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate admin found" });
    }
    admin.username = username;
    admin.password = password;

    const updatedAdmin = await admin.save();
    res.json({ message: `${updatedAdmin.username} updated` });
};

const deleteAdmin = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Id is not provided" });
    }
    const admin = await Admin.findById(id);
    if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
    }
    const result = await admin.deleteOne();
    if (result) {
        return res.status(204).json({ message: "Admin deleted" });
    }
};

module.exports = {
    createAdmin,
    updateAdmin,
    deleteAdmin,
};
