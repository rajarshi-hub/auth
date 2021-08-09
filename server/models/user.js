const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const salt_i=10;
const jwt=require('jsonwebtoken')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    token:{
        type:String,

    }
})

userSchema.pre('save',function(next){
 var user=this;
 if(user.isModified('password'))
 {
    bcrypt.genSalt(salt_i,function(err,salt){
        if(err)
        return next(err)
     
        bcrypt.hash(user.password,salt,function(err,hash){
         if(err)
     return next(err);
        user.password=hash;
        next();
       })
     }) 

 }
 else
 {
 next()
 }
})

userSchema.methods.comparePassword = function(pass,cb){
    bcrypt.compare(pass,this.password,function(err,isMatch){
        if(err)
        throw cb(err);
        cb(null,isMatch);
        //res.status(200).send(isMatch)
    })

}
userSchema.methods.generateToken = function(cb){

    var user=this;
    var token=jwt.sign(user._id.toHexString(),'happy')
    user.token=token
    user.save(function(err,user){
        if(err) throw cb(err)
        else
        cb(null,user)

    })
}
userSchema.statics.findByToken=function(token,cb){
    const user=this
    jwt.verify(token,'happy',function(err,decode){
        user.findOne({"_id":decode,"token":token},function(err,use){
             if(err) return cb(err)
             cb(null,use)
        })
    })
}
const User = mongoose.model('User',userSchema)

module.exports = {User}