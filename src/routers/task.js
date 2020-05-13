const express = require('express');
const router = new express.Router()
const Task = require('../models/task')
router.post('/task',async (req,res)=>{
    const task = new Task(req.body)
    try {
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/task',async (req,res)=>{
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/task/:id',async (req,res)=>{
    const task_id = req.params.id
    try {
        const tasks = await Task.findById((task_id))
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.patch('/task/:id',async (req,res)=>{
    const updates = Object.keys(req.body)
    updatesAlowed = ['description','completed']
    const isValid = updates.every((update)=>{
       return  updatesAlowed.includes(update)
    })
    if(!isValid){
        return res.status(400).send("Invaild Updates")
    }else{
        try{
            const task = await Task.findById(req.params.id)

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
router.delete('/task/:id',async (req,res)=>{
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(400).send("Invaild Updates")
        }
        res.send(task)
    } catch (error) {
        res.status(501).send(error)
    }
})
module.exports = router