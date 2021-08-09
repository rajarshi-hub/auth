const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const cookieParser=require('cookie-parser');
const {auth}=require('./auth')
mongoose.Promise=global.Promise;

mongoose.connect('mongodb://localhost:27017/auth')
app.use(express.json());
app.use(cookieParser())


const {User} =require('./models/user')


app.post('/api/user',(req,res)=>{
    const user=new User({
        email:req.body.email,
        password:req.body.password
    })
user.save((err,doc)=>{
    if(err)
    res.status(400).send(err)
    res.status(200).send(doc)
})
})
app.post('/api/user/login',(req,res)=>{

    User.findOne({'email':req.body.email},(err,user)=>
    {
        if(!user) res.json({message:"user not found"})
        else{
        user.comparePassword(req.body.password,(err,match)=>{
            if(err) throw(err)
            if(!match)
            return res.status(400).json({message:"wrong Password"})
            else
            {
                user.generateToken((err,user)=>{
                    if(err) res.status(400).send(err)
                    else
                    res.cookie('auth',user.token).send('ok')
                })
            }
        })
    } 
    })
})
app.get('/user/profile',auth,(req,res)=>{

    res.status(200).send(req.token)
})




const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Started on port  ${port}` )
})