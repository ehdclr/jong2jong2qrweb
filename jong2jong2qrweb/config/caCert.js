var forge = require("node-forge");
var fs = require("fs");
var pki= forge.pki;




// 1. CA 인증서생성
// generate a keypairand create an X.509v3 certificate
var caKeys= pki.rsa.generateKeyPair(2048);
var caCert= pki.createCertificate();



// CA 개인키파일저장
console.log(pki.privateKeyToPem(caKeys.privateKey));
fs.writeFileSync("caPrivateKey.pem", pki.privateKeyToPem(caKeys.privateKey));
console.log("CA개인키저장-caPrivateKey.pem\n");


caCert.publicKey= caKeys.publicKey;
caCert.serialNumber= "01";
let date = new Date();
caCert.validity.notBefore= date;
caCert.validity.notAfter= date;
caCert.validity.notAfter.setFullYear(caCert.validity.notBefore.getFullYear() + 1);



var caAttrs= [
    {
        //name: 'commonName', // CN
        shortName: "CN",
        value: "HJlee",
    },
        
    {
        //name: 'countryName', // C
        shortName: "C",
        value: "KR",
    },
    {
        //name: 'stateOrProvinceName', // ST
        shortName: "ST",
        value: "gyeonggido",
    },
    {
        //name: 'localityName', // L
        shortName: "L",
        value: "goyangsi",
    },
    {
        //name: 'organizationName', // O
        shortName: "O",
        value: "joongbu",
    },
    {
        //name: 'organizationalUnitName',
        shortName: "OU",
        value: "is",
    },
];

caCert.setSubject(caAttrs);
caCert.setIssuer(caAttrs);




caCert.setExtensions([
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


// self-signed certificate
caCert.sign(caKeys.privateKey);
console.log("CA 자체서명인증서생성");
console.log(pki.certificateToPem(caCert));
var verified = caCert.verify(caCert);
console.log("CA인증서생성후검증: "+ verified);
console.log();

// CA 인증서저장
fs.writeFileSync("caCert.pem", pki.certificateToPem(caCert));
console.log("CA인증서저장-caCert.pem");