require("dotenv").config();
const express = require("express");
const sequelize = require("./config/sequelize");
const User = require("./model/user");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

// Database Config

const loggingMiddleware = (req, res, next) => {
  console.log("You just Hit a Route");
  next();
};

app.use(loggingMiddleware);

const mockUser = [
  {
    id: 1,
    username: "Jane Doe",
    email: "example1@gmail.com",
  },
  {
    id: 2,
    username: "Mike Ross",
    email: "example2@gmail.com",
  },
  {
    id: 3,
    username: "Harvey Specter",
    email: "example3@gmail.com",
  },
  {
    id: 1,
    username: "Jane Doe",
    email: "example1@gmail.com",
  },
  {
    id: 2,
    username: "Mike Ross",
    email: "example2@gmail.com",
  },
  {
    id: 3,
    username: "Harvey Specter",
    email: "example3@gmail.com",
  },
  {
    id: 1,
    username: "Jane Doe",
    email: "example1@gmail.com",
  },
  {
    id: 2,
    username: "Mike Ross",
    email: "example2@gmail.com",
  },
  {
    id: 3,
    username: "Harvey Specter",
    email: "example3@gmail.com",
  },
  {
    id: 1,
    username: "Jane Doe",
    email: "example1@gmail.com",
  },
  {
    id: 2,
    username: "Mike Ross",
    email: "example2@gmail.com",
  },
  {
    id: 3,
    username: "Harvey Specter",
    email: "example3@gmail.com",
  },
];

const mockProduct = [
  {
    id: 1,
    name: "Shoe",
    description: "This is a description",
  },
  {
    id: 2,
    name: "Bag",
    description: "This is a description",
  },
  {
    id: 3,
    name: "Wrist-Watch",
    description: "This is a description",
  },
  {
    id: 4,
    name: "Bag",
    description: "This is a description",
  },
  {
    id: 5,
    name: "Bag",
    description: "This is a description",
  },
];

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(403).json({ message: "You must provide a valid input" });
  }

  const user = await User.findOne({ where: { email } });

  if (user) {
    return res
      .status(403)
      .json({ message: "Sorry a user with this email already exist" });
  }

  if (password.length < 6) {
    return res.status(403).json({
      message: "Password is too short...Must be at least 6 characters",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    email,
    name,
    password: hashedPassword,
  };

  await User.create(newUser);
  return res.status(201).json({ message: "User created Successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "This User Does not exist in our Record..." });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(403).json({ message: "Incorrect Credential" });
    }

    const accessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    

    return res.status(200).json({ message: "Login Successfully", accessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error ${error.message}` });
  }
});

app.listen(3000, async () => {
  try {
    await sequelize.sync();
  } catch (error) {
    console.log("There was an error connecting to the database" + error);
  }
  console.log(`Server is running on http://localhost:3000`);
});
