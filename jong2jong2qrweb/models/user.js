const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cert: {
        type: String,
        required: false,
    },
});


const User = mongoose.model('User', UserSchema);

//함수만들기 User 객체 아이디가 있는 지 질의를 해서 응답하는거
User.getUserById = function(id,callback){
    User.findById(id, callback);
}
//username을 알고 있을 때 질의 해서 응답하는 것 findOne 몽구스 함수 사용 
User.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
}

User.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err,hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });


}

User.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) =>{
        if(err) throw err;
        callback(null, isMatch);
    });
}

// 사용자 리스트 응답 
User.getAll =function (callback) {
    User.find(callback);
};

// Update user's certificate
User.saveCert= function (username, cert, callback) {
    const query = { username: username };
    const update = { cert: cert };
    User.findOneAndUpdate(
        query,
        update,
        { new: true, useFindAndModify: false }
        ,callback
        );
    };

module.exports = User;

//외부에서 사용이 가능하도록 출력  한 모듈이 됨 