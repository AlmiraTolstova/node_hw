import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import User from "./models/user.js";

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    const { username, password, email, name, role } = req.body;

    const user = await User.findOne({
      where: { email: email },
    });
    if (user) {
      res
        .json({
          status: "error",
          message: "User with this email exist!",
        })
        .status(401);
    } else {
      try {
        const newUser = await User.create({
          username: username,
          password: await bcrypt.hash(password, 10),
          email: email,
          name: name,
          mustChangePassword: false,
          role: role,
        });
        if (newUser) {
          console.log("user created", newUser.toJSON);
          res
            .json({
              status: "success",
              message: "Successfull created new User!",
              data: {
                newUser,
              },
            })
            .status(200);
        }
      } catch (error) {
        console.error("Failed to create user:", error);
        res
          .json({
            status: "error",
            message: error,
          })
          .status(500);
      }
    }
  } catch (err) {
    res
      .json({
        status: "error",
        message: err,
      })
      .status(500);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username: username },
    });
    if (user !== undefined) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        console.log(user);
        res.json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            mustChangePassword: user.mustChangePassword,
          },
        });
      } else {
        res.status(401).send("Error! User or password invalid");
      }
    } else {
      res.status(401).send("Error! User or password invalid");
    }
  } catch (err) {
    res.status(500).send("Error! User or password invalid");
  }
});

app.post("/change-password", async (req, res) => {
  try {
    const { newPassword, username, password } = req.body;
    const user = await User.findOne({
      where: { username: username },
    });

    if (user !== undefined) {
      try {
        const check = await bcrypt.compare(password, user.password);
        if (check) {
          console.log(user);

          const [updatedRowsCount] = await User.update(
            {
              password: await bcrypt.hash(newPassword, 10),
              mustChangePassword: false,
            },
            { where: { id: user.id } },
          );
          if (updatedRowsCount > 0) {
            res.json({
              message: "Password was changed successful",
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                mustChangePassword: user.mustChangePassword,
              },
            });
          }
        } else {
          res.status(404).send("Error! User or password invalid");
        }
      } catch (error) {
        res.status(500).send("Error! User or password invalid", err);
      }
    } else {
      res.status(404).send("Error! User or password invalid");
    }
  } catch (err) {
    res.status(500).send("Error!", err);
  }
});

app.post("/delete-account", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username: username },
    });

    if (user === undefined) {
      res.status(404).send("User not found!");
    } else {
      try {
        const updatedRowsCount = await User.destroy({ where: { id: user.id } });
        if (updatedRowsCount > 0) {
          res.status(200).send("User was deleted!");
        }
      } catch (error) {
        res.status(500).send("Error!", err);
      }
    }
  } catch (err) {
    res.status(500).send("Error!", err);
  }
});

app.get("/admin", fakeAuth, authorizeRole("admin"), (req, res) => {
  res.json({
    message: "Добро пожаловать, админ",
    user: req.user,
  });
});

app.post("/change-email", async (req, res) => {
  try {
    const { newEmail, username, password } = req.body;
    const user = await User.findOne({
      where: { username: username },
    });

    try {
      const existedUsersEmail = await User.findOne({
        where: { email: newEmail },
      });

      if (existedUsersEmail) {
        res.status(500).send("Error! Email is not correct");
      }
      if (user !== undefined) {
        try {
          const check = await bcrypt.compare(password, user.password);
          if (check) {
            console.log(user);

            const [updatedRowsCount] = await User.update(
              {
                email: newEmail,
              },
              { where: { id: user.id } },
            );
            if (updatedRowsCount > 0) {
              const existedUsers = await User.findOne({
                where: { email: newEmail },
              });
              res.json({
                message: "Email changed successful",
                user: {
                  id: existedUsers.id,
                  username: existedUsers.username,
                  email: existedUsers.email,
                  name: existedUsers.name,
                  mustChangePassword: existedUsers.mustChangePassword,
                },
              });
            }
          } else {
            res.status(404).send("Error! User or password invalid");
          }
        } catch (error) {
          res.status(500).send("Error! User or password invalid", err);
        }
      } else {
        res.status(404).send("Error! User or password invalid");
      }
    } catch (err) {
      res.status(500).send("Error!", err);
    }
  } catch (err) {
    res.status(500).send("Error!", err);
  }
});

function fakeAuth(req, res, next) {
  req.user = {
    role: "admin",
  };

  next();
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      return res.status(403).json({
        message: "Доступ запрещён",
      });
    }
  };
}

export default authorizeRole;

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
