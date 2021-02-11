const express = require("express"); //express 모듈을 가져온다.
const app = express(); // 모듈의 펑션을 이용해서 새로운 express APP을 생성한다
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://sohhho:clust3r1526@cluster0.x2eua.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected...")) //질 연결되었는지 확인
  .catch((err) => console.log(err)); // 에러 발생하면 알려줌

app.get("/", (req, res) => res.send("Hello World! Welcome to Node JS World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); //5000번 포트에서 앱 실행
