const express = require('express');
const router = new express.Router()
const auth =  require('../middleware/auth')
const Task = require('../models/task')
router.post('/task',auth,async (req,res)=>{
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/task',auth,async (req,res)=>{
    try {
        const tasks = await Task.find({owner:req.user._id})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/task/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try {
        const task = await Task.find({
            _id:_id,
            owner:req.user._id
        })
        console.log(task)
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/taskall',async (req,res)=>{
    const tasks = await Task.find({})
    res.send(tasks)
})
router.patch('/task/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    updatesAlowed = ['description','completed']
    const isValid = updates.every((update)=>{
       return  updatesAlowed.includes(update)
    })
    if(!isValid){
        return res.status(400).send("Invaild Updates")
    }else{
        try{

            const task = await Task.findOne({
                _id:req.params.id,
                owner:req.user._id
            })
            updates.forEach((update)=>{
                task[update] = req.body[update]
            })
            await task.save()
            if(!task){
                return res.status(404).send("No Such task")
            }
            res.send(task)
        }catch(e){
           res.status(500).send(e)
        }
    }
})
router.delete('/task/:id',auth,async (req,res)=>{
    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){  
            return res.status(400).send("Invaild Updates")
        }
        else{
            await Task.deleteOne({_id:req.params.id,owner:req.user._id})
            res.send(task)
        }
        
    } catch (error) {
        res.status(501).send(error)
    }
})
module.exports = router