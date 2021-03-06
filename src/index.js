const express = require('express')
require('./db/mongoose')
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')
const Task = require('../src/models/task')
const User = require('./models/user')
const multer = require('multer');
const upload = multer({
    dest:'images'
})
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

