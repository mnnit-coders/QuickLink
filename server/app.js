const express=require('express');
const app=express();
const bodypsrser=require('body-parser')
const cors=require('cors');
app.use(cors());
app.use(bodypsrser());
app.use(bodypsrser.urlencoded({ extended: true }))
app.use(express.json());
app.use('/new',(req,res)=>{
    let count=0;
    console.log(count++)
    res.json({
        "name":"rahul"
    })
})
let server=app.listen(5000,()=>{
    console.log('running successfully');
})
const io=require('socket.io')(server,{
    cors: {
        origin: "http://localhost:3000"
    }
});
io.on('connection',(socket)=>{
    socket.on('sender-join',function(data){
       console.log(data);
        socket.join(data);
    }) 
    socket.on('receiver-join',(data)=>{
        console.log(data);
        socket.join(data);
    })
    socket.on('iterations',(data)=>{
        socket.in(data.uid).emit('iterated',{
            i:data.iterate
        })
    })
    socket.on('fs-meta',(data)=>{
        // console.log(data)
        socket.in(data.uid).emit('receiver-meta',{
            metadata:data.metadata
        })
    })
    socket.on('fs-start',(data)=>{
        console.log(data)
        socket.in(data.uid).emit('fs-share',{
            value:1200
        })
    })
    socket.on('data',(data)=>{
        console.log(data);
        socket.in(data.uid).emit('receivemsg',{
            msg:data.msg
        });
    })
})