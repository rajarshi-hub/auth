const bcrypt = require('bcrypt');
const {MD5} =require('crypto-js')


/*bcrypt.genSalt(10,(err,salt)=>{
    if(err)
    return next(err);

    bcrypt.hash('pass1234',salt,(er,hash)=>{
        if(err)
    return next(err);
    console.log(hash)

    })

})*/
const id='1000';
const secret='happy';
const receivedtoken='eyJhbGciOiJIUzI1NiJ9.MTAwMA.g0-GealLFSLekVht5Zlb_mNw_tygF76cfSoclhhuu_E23'
const token=jwt.sign(id,secret);
const decodeToken = jwt.verify(receivedtoken,secret)
console.log(decodeToken);