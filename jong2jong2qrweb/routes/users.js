const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/database');

const forge = require("node-forge");
const fs = require('fs');

const pki = forge.pki;

const caCertPem = fs.readFileSync("config/caCert.pem", "utf8");
const caPrivateKeyPem = fs.readFileSync("config/caPrivateKey.pem","utf8");
const caCert= pki.certificateFromPem(caCertPem);
const caPrivateKey= pki.privateKeyFromPem(caPrivateKeyPem);


// 1.사용자 등록 
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    //유저네임이 기존에 있는 지 확인
    User.getUserByUsername(newUser.username, (err, user) => {
        if (err) throw err; //건너뛰고 실행 x
        if (user) {
            return res.json({ success: false, msg: '같은 아이디가 존재합니다. 다른 아이디를 입력하세요.'});
        } else {
            User.addUser(newUser, (err, user) => {
                if(err) {
                    res.json({ success: false, msg: '사용자 등록 실패'})
                } else {
                    res.json({ success: true, msg: '사용자 등록 성공'})
                }
        });
        }
    })

    

})


//2.사용자 인증 및 JWT 토큰 발급 
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUsername(username, (err,user) =>{
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found. 등록된 사용자가 없습니다.'});
        }
        User.comparePassword(password, user.password, (err,isMatch) => {
            if(err) throw err;
            if(isMatch) {
                let tokenUser = {
                    _id:user._id,
                    name:user.name,
                    username:user.username,
                    email:user.email
                }
                const token =jwt.sign({data:tokenUser}, config.secret,{
                    expiresIn: 604800 // 1week
                });
                res.json({
                    success:true,
                    token: token,
                    userNoPW:tokenUser
                });
            }else{
                return res.json({success:false, msg:'Wrong password. 패스워드가 맞지 않습니다.'});
            }
        });
    });
});





router.post('/authenticateSig', (req, res, next) => {
    const username = req.body.username;
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: "User not found!" });
        } else {
            // Verify user's digital signature with certificate
            const currentTime= req.body.currentTime; // client's current time
            const signatureHex= req.body.signatureHex;
            const certPem= user.cert;
            const cert = pki.certificateFromPem(certPem);
            const publicKey= cert.publicKey;
            const signature = forge.util.hexToBytes(signatureHex);
            const common = cert.subject.getField("CN").value;
            const currentTime1 = new Date().getTime(); // Server's current time
            
            const diffTime= currentTime1 -currentTime; // time difference
            let md = forge.md.sha1.create(); 
            md.update(username + currentTime, "utf8");
            if (!publicKey.verify(md.digest().bytes(), signature)) {
                return res.json({
                    success: false,
                    msg: "Login not successful. Digital signature not valid... ",
                });
            }

            // Digital signature verification
            let verified1 = publicKey.verify(md.digest().bytes(), signature);
            // Certificate verification. In statefulmode it is not required...
            let verified2 = caCert.verify(cert);
            // Time verification. Anti-replay attack
            let verified3 = false;
            if (diffTime< 3600000) verified3 = true;
            // Verify username
            let verified4;
            if (username == common) verified4 = true;
            
            if (verified1 == true && verified2 == true &&
                verified3 == true && verified4 == true ) {
                    let tokenUser= {
                        _id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                    };
                    
                    const token = jwt.sign({ data: tokenUser}, config.secret, {
                        expiresIn: 604800, //1week = 7*24*60*60
                    });
                    res.json({
                        success: true,
                        token: token,
                        userNoPW: tokenUser,
                        msg: "One-click signature login successful",
                    });
                } else {
                    return res.json({
                        success: false,
                        msg: "Login not successful. Something wrong... ",
                    });
                }
            }
        });

});




//3-1. profile 요청 
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({
      user: {
        name: req.user.name,
        username: req.user.username,
        email: req.user.email
      }
    });
  });

router.get("/list", (req,res,next) => {
    User.getAll((err,users) => {
        if(err) throw err;
        res.json(users);
    });
});


//5. 인증서 발급
router.post("/cert", (req,res,next) => {
    let cert = pki.createCertificate();
    cert.publicKey= pki.publicKeyFromPem(req.body.publicKey);
    cert.serialNumber= "100";
    cert.validity.notBefore= new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    var userAttrs= [
        {
        shortName: "CN",
        value: req.body.common,
    },
    {
        shortName: "C",
        value: req.body.country,
    },
    {
        shortName: "ST",
        value: req.body.state,
    },
    {
        shortName: "L",
        value: req.body.locality,
    },
    {
        shortName: "O",
        value: req.body.organization,
    },
    {
        shortName: "OU",
        value: req.body.orgUnit,
    },
];
cert.setSubject(userAttrs);

var caAttrs= [
    {
        shortName: "CN",
        value: caCert.subject.getField("CN").value,
    },
    {
        shortName: "C",
        value: caCert.subject.getField("C").value,
    },
    {
        shortName: "ST",
        value: caCert.subject.getField("ST").value,
    },
    {
        shortName: "L",
        value: caCert.subject.getField("L").value,
    },
    {
        shortName: "O",
        value: caCert.subject.getField("O").value,
    },
    {
        shortName: "OU",
        value: caCert.subject.getField("OU").value,
    },
];

cert.setIssuer(caAttrs);


cert.setExtensions([
    {
    name: "basicConstraints",
    cA: true,
}, 
{
    name: "keyUsage",
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
},
{
    name: "extKeyUsage",
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true,
},
{
    name: "nsCertType",
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true,
},
{
    name: "subjectAltName",
    altNames: [
        {
            type: 6, // URI
            value: "http://example.org/",
        },
        {
            type: 7, // IP
            ip: "127.0.0.1",
        },
    ],
},
{
    name: "subjectKeyIdentifier",
},
]);

cert.sign(caPrivateKey);
let certPem= pki.certificateToPem(cert);

User.saveCert(req.body.common, certPem, (err, cert) => {
    if (err) throw err;
    if (cert) {
        return res.json({
            success: true,
            cert: certPem,
            caCert: caCertPem,
        });
    } else {
        return res.json({
            success: false,
            msg: "Certificate issuing failed...",
        });
    }
});

});




module.exports =router;