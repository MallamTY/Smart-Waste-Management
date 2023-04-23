

export const generateOTP = (lengthOTP) => {
    var characters= '0123456789';;
    let OTP = '';
    for (let i = 0; i < lengthOTP; i++){
        OTP += characters.charAt((Math.random() * characters.length));
    }
    return OTP;

};