import React,{useState,useEffect} from 'react'
import '../css/sendbox.css'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import uploadicon from "../assets/uploadicon.svg"
import SendIcon from '@mui/icons-material/Send';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import io from 'socket.io-client';
var ENDPOINT='http://localhost:5000'
var newfilebuffers;
function Sendbox() {
   var socket=io(ENDPOINT)
    const [files,setFiles]=useState('');
    const [filetype,setType]=useState('');
    const [filebuffer,setfileBuffer]=useState();
    const [otp,setOtp]=useState(0);
    useEffect(()=>{
      socket.on('fs-share',(data)=>{
        console.log(newfilebuffers)
        if(data.value===1200){
          let chunk=newfilebuffers.slice(0,1024);
          console.log(chunk)
           newfilebuffers=newfilebuffers.slice(1024,newfilebuffers.length);
          // setfileBuffer(newfilebuffer);
          if(chunk.length !== 0){
           socket.emit('data',{
                 uid:otp,
                 msg:chunk
               })
          }
          else{
           console.log('file shared successfully');
          }
        }
      })
    },[filebuffer])
    const handleUpload=()=>{
      console.log('clicked upload')
    }

    const handleChange=(file)=>{
      setType(file.type)
      setFiles(file.name)
     
      let reader=new FileReader();
      reader.onload=(e)=>{
        let buffer=new Uint8Array(reader.result);
        let newval = {...filebuffer}
        newval = buffer;
        setfileBuffer(newval)
        newfilebuffers=buffer;
        console.log(buffer);
      }
      reader.readAsArrayBuffer(file);
    }
    const handleroom=()=>{
      var val=Math.floor(Math.random() * 899999 + 100000);
      setOtp(val);
      socket.emit('sender-join',val)
   }
  //  socket.on('fs-share',(data)=>{
  //   console.log(data)
  //  })
  // socket.on('fs-share',(data)=>{
  //   console.log(filebuffer)
  //   if(data.value===1200){
  //     let chunk=filebuffer.slice(0,1024);
  //     let newfilebuffer=filebuffer.slice(1024,filebuffer.length);
  //     setfileBuffer(newfilebuffer);
  //     if(chunk.length !== 0){
  //      socket.emit('data',{
  //            uid:otp,
  //            msg:chunk
  //          })
  //     }
  //     else{
  //      console.log('file shared successfully');
  //     }
  //   }
  // })
   const handlesend=()=>{
    console.log(filebuffer)
    socket.emit('fs-meta',{
      uid:otp,
      metadata:{
        type:filetype,
        filename:files,
        length:filebuffer.length
      }
    });
    // socket.on('fs-share',(data)=>{
    //   console.log(data)
    //   if(data.value===1200){
    //     let chunk=filebuffer.slice(0,1024);
    //     let newfilebuffer=filebuffer.slice(1024,filebuffer.length);
    //     setfileBuffer(newfilebuffer);
    //     if(chunk.length !== 0){
    //      socket.emit('data',{
    //            uid:otp,
    //            msg:chunk
    //          })
    //     }
    //     else{
    //      console.log('file shared successfully');
    //     }
    //   }
    // })
  }
  return (
   <>
     {/* <Card sx={{ maxWidth: 345 }}>
      
      <CardContent className="send-container">
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
      <Button  variant='contained' style={{backgroundColor:'#295f87'}} fullWidth={true}>Send</Button>
        
      </CardActions>
    </Card> */}
    <div className="send-container">

    <label>
        <input type="file" accept="image/*,.pdf,.mp3,.mp4,.zip" onChange={(e)=>handleChange(e.target.files[0])} id="upload-input" style={{display:'none'}} multiple/>
      <img src={uploadicon} alt="" />
    </label>
    <div className='btns'>
      <h1 id='filename'>{files}</h1>
        <h1 id='otpdisplay' >{otp}</h1>
        <Button  variant='contained' style={{backgroundColor:'#295f87',margin:'10px 0px'}} fullWidth={true} endIcon={<ConnectWithoutContactIcon/>} onClick={handleroom}>Create Room</Button>
        <Button  variant='contained' style={{backgroundColor:'#22c1d4'}} fullWidth={true} endIcon={<SendIcon  />} onClick={handlesend}>Send</Button>
        </div>
        {/* <div className="send-items">
        
        </div>
        <div className='btns'>
        <Button  variant='contained' style={{backgroundColor:'#295f87'}} fullWidth={true}>Send</Button>
       
        </div> */}
    </div>
   </>
  )
}

export default Sendbox