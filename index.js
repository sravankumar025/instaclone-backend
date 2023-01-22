const express = require("express");
const cors = require("cors");
const port = 8080 || process.env.port;
const app = express();
const fileUpload = require("express-fileupload");
const { IPost } = require("./models/Post");
const mongoose = require("mongoose");
const path = require("path");

const {v4:uniquekeyGenerate}=require("uuid");

app.use(cors());
app.use(express.json());
app.use(fileUpload());
mongoose.set('strictQuery', false);
mongoose.connect(
  `mongodb+srv://sravankumar:sravan3025@cluster0.xbuoc6m.mongodb.net/?retryWrites=true&w=majority`,
  (err) => {
    if (err) {
      console.log("Connection to mongodb failed");
    } else {
      console.log("Connected to mongodb succesffuly");
    }
  }
);

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});

app.post("/api", (req, res) => {
  const date = new Date();
  let finalDate = date + "";
  finalDate = finalDate.split(" ");
  const newdate = finalDate[2] + " " + finalDate[1] + " " + finalDate[3];
  const { username, address, description } = req.body;
  const { image_file } = req.files;
  
  const filearray=image_file.name.split(".");
  const filextension=filearray[filearray.length-1];
  const uniquekey=uniquekeyGenerate();
  const filename=uniquekey +"."+filextension;
  if(['jpeg','jpg','png','svg'].includes(filextension)){
    image_file.mv("./uploads/" + filename, async (err) => {
      if (err) {
        res.json({ message: err });
      } else {
        const post = new IPost({
          ...{ username, address, description },
          image_file: filename,
          likes: 0,
          date: newdate,
        });
        try {
          const response = await post.save();
          res.json({ message: "Everything is fine", response });
        } catch (e) {
          res.json({
            message: "Something is wrong, not able to create",
            response: e,
          });
        }
      }
    });
  }else{
    res.json({
      status:'failed',
      message:'Upload an image file, other than that not accepted'
    })
  }
});

app.get("/all", async (req, res) => {
  res.json({ result: await IPost.find() });
});

app.get("/images/:fileName", async (req, res) => {
  res.sendFile(path.join(__dirname, `./uploads/${req.params.fileName}`));
});
