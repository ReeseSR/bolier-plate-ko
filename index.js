const express = require("express"); //express 모듈을 가져온다.
const app = express(); // 모듈의 펑션을 이용해서 새로운 express APP을 생성한다
const port = 5000;
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/Users");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected...")) //질 연결되었는지 확인
  .catch((err) => console.log(err)); // 에러 발생하면 알려줌

app.get("/", (req, res) => res.send("JS가 좋니"));

app.post("/register", (req, res) => {
  //회원 가입 시 필요한 정보들을 클라이언트에서 가져오면
  //그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); //5000번 포트에서 앱 실행
