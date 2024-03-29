import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  // validation
  if (!name) return res.status(400).send("Name is required");
  if (!password) return res.status(400).send("Password is required");
  if (password.length < 6)
    return res.status(400).send("Password requires 6 characters");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send("Email is taken");
  //register
  const user = new User(req.body);
  try {
    await user.save();
    console.log("USER CREATED", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("CREATE USER FAILED", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req, res) => {
  //console.log(req.body);
  const { email, password } = req.body;
  try {
    //search for matching user
    let user = await User.findOne({ email }).exec();
    //console.log("USER EXIST");
    if (!user) res.status(400).send("Email not found");
    //compare password
    user.comparePassword(password, (err, match) => {
      console.log("COMPARE PASSWORD LOGIN ERR", err);
      if (!match || err) return res.status(400).send("Wrong password");
      //GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT");
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    });
  } catch (err) {
    console.log("LOGIN ERR", err);
    res.status(400).send("Signin failed");
  }
};
