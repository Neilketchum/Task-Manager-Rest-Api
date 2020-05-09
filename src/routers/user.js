const express = require('express')
const User = require('../models/task')
const router = new express.Router()
router.get('/test',(req,res)=>{
    res.send("From a new file")
})

router.post('/users',async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(200).send(user)
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
router.get('/users/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById((_id))
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})
router.patch('/users/:id',async (req,res)=>{
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
            const user = await User.findByIdAndUpdate(user_id,req.body,{
                new : true, 
                runValidators:true
            })
            if(!user){
                return res.status(404).send("No Data")
            }
            res.send(user)
        } catch (error) {
            res.status(501).send(error)
        }
    }
})
router.delete('/users/:id',async (req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(400).send("Invaild Updates")
        }
        res.send(user)
    } catch (error) {
        res.status(501).send(error)
    }
})
module.exports = router