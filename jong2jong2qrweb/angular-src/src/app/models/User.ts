export interface User {
    name: String;
    email: String;
    username: String;
    password: String;
    
}

export interface Login {
    username: String;
    password: String;
}

export interface UserNoPW {
    _id: String;
    name: String;
    email: String;
    username: String;
}

// 인증서발급요청
export interface CertReq{
    country: string;
    state: string;
    locality: string;
    organization: string;
    orgUnit: string;
    common: string;
    publicKey: string;
}