const mongoose = require("mongoose");

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
    maxlength: 50,
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

const User = mongoose.model("User", userSchema); //모델의 이름, 스키마

module.exports = { User }; // 모델을 다른 파일에서도 쓸 수 있게 export
