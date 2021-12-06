const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express();
const users = require('./routes/users');
const config = require('./config/database');

//Connect to Database
mongoose.connect(config.database);

// on Connection
mongoose.connection.on('connected',() => {
    console.log('Connected to Database' + config.database);

});

// on Error
mongoose.connection.on('error',(err) =>{
    console.log('Database error:' +err);
});


//port number
const port = process.env.PORT || 3000;
//서버가 운영된 컴퓨터에서 NODEJS가 제공하는 포트번호를 쓸지 이것이 아니면 3000번씀 

//app.use(function (req,res,next){
    //console.log('Time',Date.now())
  //  next()
//});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
//public 폴더를 static 폴더로 사용하게 오픈


// Passport 미들웨어
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);//passport 파일에서 passport 파라미터 


app.use('/users',users);// users라는 라우팅 설정한 것을 연결 



/*app.get('/',(req, res) => {
    res.send('<h1>서비스 준비중입니다.....</h1>');
});

app.get('/eng',(req, res) => {
    res.send('<h1>Service under construction...</h1>');
});*/

//start server
app.listen(port, function() {
    console.log(`Server started on port ${port}`);
});