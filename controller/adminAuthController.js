const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const foundUser = await Admin.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: 'Unauthorized' });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        foundUser,
        role:"admin"
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken });
};

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    const foundUser = await Admin.findOne({ username: decoded.username }).exec();

    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

    const accessToken = jwt.sign(
      {
        UserInfo: {
            foundUser,
            role:"admin"
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );

    res.json({ accessToken });
  });
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
};

module.exports = {
  login,
  refresh,
  logout
};
