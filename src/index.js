const express = require('express')
require('./db/mongoose')
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')
const jwt = require('jsonwebtoken')
// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send('GET Requests Disabled')
//     }else{
//         next()
//     }   
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
const myfunction = async ()=>{
    const token = jwt.sign({
        _id:'abcd123'
    },'thisismynewCourse',{
        expiresIn:'7 days'
    })
    console.log(token)
    const data = jwt.verify(token,'thisismynewCourse')
    console.log(data)
}
myfunction()

