const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
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
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(400).send("Invaild Updates")
        // }
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
module.exports = router