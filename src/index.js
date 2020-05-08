const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users',async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(200).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})
app.get('/users',async (req,res)=>{
    try{
        const response  = await User.find({})
        res.status(200).send(response)
    }catch(e){
        res.status(400).send(e)
    }
})
app.get('/users/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById((_id))
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})
app.patch('/users/:id',async (req,res)=>{
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
app.post('/task',async (req,res)=>{
    const task = new Task(req.body)
    try {
        await res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get('/task',async (req,res)=>{
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})
app.get('/task/:id',async (req,res)=>{
    const task_id = req.params.id
    try {
        const tasks = await Task.findById((task_id))
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})