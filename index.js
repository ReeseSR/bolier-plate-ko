const express = require("express"); //express 모듈을 가져온다.
const app = express(); // 모듈의 펑션을 이용해서 새로운 express APP을 생성한다
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./server/config/key");
const { auth } = require("./server/middleware/auth");
const { User } = require("./server/models/User");

//application/x-www-form-urlencoded
/*app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post('/register', (req, res) => {

  //회원 가입 할떄 필요한 정보들을  client에서 가져오면 
  //그것들을  데이터 베이스에 넣어준다. 
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/login', (req,res) =>{
  //요청된 이메일을 데이터베이스에서 찾는다. 
  User.findOne({email: req.body.email},(err, user) =>{
    //이메일이 없을 경우(유저 없음)
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인. 
    
    user.comparePassword( req.body.password, (err, isMatch)=>{
      if(!isMatch)
      return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      //비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err); //에러가 있다는 걸 클라이언트에 보냄 . 

        //토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지... 
        res.cookie("x_auth",user.token)
        .status(200) //접속 성공 표시
        .json({loginSuccess: true, userID: user._id}) //데이터 보내줌
      })

    })

  })
})*/

/*John Ahn 님 예제 */

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!~~ "));

app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))

app.post("/api/users/register", (req, res) => {
  //회원 가입 할떄 필요한 정보들을  client에서 가져오면
  //그것들을  데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    //콜백함수로 에러와 받은 정보를 넘긴다.
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
    })
  })
})

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      })
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log("err", err);
      console.log("isMatch", isMatch);
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 이야기는 Authentication이 true
  //True라는 걸 client에게 전달해줘야 함.

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, //Admin유저인지. 현재는 role 0 이 일반유저 니머지는 Admin
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
})

app.get("/api/users/logout", auth, (req, res) => {
  //로그아웃하려는 유저 모델을 찾아서 업데이트한다.
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    })
  })
})


const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); //5000번 포트에서 앱 실행
