const express = require('express')
const User = require('../models/user')
const Task  = require('../models/task')
const auth = require('../middleware/auth')
const Sharp = require('sharp');
const router = new express.Router()
router.get('/test',(req,res)=>{
    res.send("From a new file")
})
router.post('/users/login',async(req,res)=>{
    try {
        const user = await User.findByCredential(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token     
        })
        await user.save()
    }  catch (error) {
        res.status(404).send(error)
    }
})
router.post('/users',async (req, res) => {
    try{
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        // await user.save()
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users',async (req,res)=>{
    try{
        const response  = await User.find({})
        res.status(200).send(response)
    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})
router.get('/users/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById((_id))
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})
const multer = require('multer');
// PROFILE PICTURE
const avatar = multer({ 
    limits:{
        fileSize: 2000000 
    },
    fileFilter(req,file,cb){
     if(!file.originalname.endsWith('jpg')){
        cb(new Error('Upload jpg'))
     }else{
        cb(undefined,true)
     }
        // cb(new Error('Upload JPEG'))
        // cb(undefined,true)
        // cb(undefined,false)
    }
})
router.post('/users/me/avatar',auth,avatar.single('avatar'),async (req,res)=>{
    const buffer = await Sharp(req.file.buffer).resize({
        width:250,
        height:250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(201).send("Upload Successful")
},(error,req,res,next)=>{
    res.status(501).send({
        error : error.message
    })
})
router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send("Succesfully Deleted")
})
router.patch('/users/update',auth,async (req,res)=>{
    const allowedUpdates = ['name','age','email','password']
    const user_id = req.params.id
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValid){
        return res.status(400).send("Invaild Updates")
    }else{
        try {
            const user = req.user

            updates.forEach((update)=>{
                user[update] = req.body[update]
            })
            await user.save()
            if(!user){
                return res.status(404).send("No Data")
            }
            res.send(user)
        } catch (error) {
            res.status(501).send(error)
        }
    }
})
router.delete('/users/me',auth,async (req,res)=>{
    try {
        const tasks = Task.find({
            owner:req.user._id
        })
        await tasks.remove()
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(501).send(error)
    }
})
router.post('/users/logout',auth,async (req,res)=>{
   try {
       req.user.tokens = req.user.tokens.filter((token)=>{
           return token.token !== req.token
       })
       await req.user.send()
       res.send(req.user)
   } catch (error) {
       res.status(500).send()
   }
})
router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user= await User.findById(req.params.id)
        if(!user.avatar || !user){
           res.status(501).send("No Image") 
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send("Cant Find Avatar")
    }
})
module.exports = router