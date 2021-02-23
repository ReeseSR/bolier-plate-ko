const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

//mongoose를 이용하여 schema를 생성합니다.

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //이메일에서 뛰워쓴 부분을 없애주는 역할 so hho@gmail -> sohhho@gmail
    unique: 1, //중복 이메일 금지
  },
  password: {
    type: String,
    minlength: 5,
  },
  //role을 주는 이유는 유저가 관리자가 될 수도 있고 일반 유저가 될 수 있기 때문에
  role: {
    type: Number, //ex. 0 : 일반 유저 1: 관리자
    default: 0, //role을 임의로 지정하지 않으면
  },
  image: String, //object 사용하지 않아도 됨
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); //에러 발생 시 념겨서 app.next에서 err 실행

      bcrypt.hash(user.password, salt, function (err, hash) {
        //hash는 암호화된 비밀번호
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567    암호회된 비밀번호 $2b$10$l492vQ0M4s9YUBfwYkkaZOgWHExahjWC
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 토큰을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  //user._id + 'secretToken' = token;
  // ->
  // 'secretToken' -> user._id

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user); //user 정보만 다시 전달
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용하여 유저를 찾은 다음
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, (err, user) => {
      if (err) return cb(err)
      cb(null, user)
    })
  })
}

const User = mongoose.model("User", userSchema);

module.exports = { User };
