import React,{useState,useEffect} from 'react'
import '../css/recievebox.css'
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import downloadicon from "../assets/downloadicon.svg"
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import io1 from 'socket.io-client'
var receivedbuffer=[];
var orotp;
function Recievebox() {
  var socket2=io1('http://localhost:5000');
  const [otpvalue,setOtpvalue]=useState(new Array(6));
  // const [orotp,setorOtpvalues]=useState();
  const [filemetadata,setMetadata]=useState({});
  // const [iterating,setInteration]=useState(0);
  useEffect(()=>{


  const digits = document.querySelectorAll('.otp-digit');
  console.log(digits);

  // digits[0].focus();

  digits.forEach((digit,index)=>{
    digit.addEventListener('keydown',(e)=>{
      if(e.key>=0 && e.key <=9 ){
        digits[index].value=''
       if(index<=5) setTimeout(()=> digits[index+1].focus(),10);
      }else if(e.key === 'Backspace'){
        if(index>=0)setTimeout(()=> digits[index-1].focus(),10);
      }
    })
  })

  },[])

  const handleChange=(pos,e)=>{
    let num = e.target.value;
    let val = otpvalue;

    val[pos]=num;

    // num*=1;

    
    // let digit = 1;
    // for(let i=pos; i>0; i--)
    // digit = digit*10;

    // digit = (val/digit) % 10;
   
    // for(let i =0;i<pos;i++){
    //   num*=10;
    //   digit*=10;
    // }

    // console.log(val + "  " + num)
    // val-=digit;
    // val+=num;
    // console.log(val)
    setOtpvalue(val);
  }

  const handleRecieve=()=>{
    let val = otpvalue;
    let otp='';
    for(let i=0;i<6;i++){
      otp+=val[i]
    }

    otp = parseInt(otp);
    console.log(otp +'here');
    console.log(otpvalue)
    // setorOtpvalues(otp);
    orotp=otp;
    socket2.emit('receiver-join',otp);
  }
  socket2.on('receiver-meta',(data)=>{
    setMetadata(data.metadata);
    socket2.emit('fs-start',{
      uid:orotp
    })
    console.log('received')
  })
  socket2.on('receivemsg',(data)=>{
    receivedbuffer.push(data.msg);
    if(receivedbuffer.length===filemetadata.length){
      let newbuffer=new Uint8Array(receivedbuffer);
      let blob=new Blob([newbuffer],{ type: `${filemetadata.type};base64` });
      var url=URL.createObjectURL(blob);
      console.log(url);
      window.open(url);
      receivedbuffer=[];
    }
    else{
      socket2.emit('fs-start',{
        uid:orotp
      })
    }
    
  })
  const handleDownload=()=>{
    console.log('clicked download')
  }
  

  return (
    <>
        <div className="recieve-container">
        
        <img src={downloadicon} onClick={handleDownload} alt="" />
        
        
            <div className='otp-container'>
              <input type="number" className='otp-digit'  onChange={(e)=>handleChange(0,e)} placeholder='0' min={0} max={9} required />
              <input type="number" className='otp-digit'  onChange={(e)=>handleChange(1,e)} placeholder='0' min={0} max={9} required />
              <input type="number" className='otp-digit'  onChange={(e)=>handleChange(2,e)} placeholder='0' min={0} max={9} required />
              <input type="number" className='otp-digit'  onChange={(e)=>handleChange(3,e)} placeholder='0' min={0} max={9} required />
              <input type="number" className='otp-digit'  onChange={(e)=>handleChange(4,e)} placeholder='0' min={0} max={9} required />
              <input type="number" className='otp-digit'  onChange={(e)=>handleChange(5,e)} placeholder='0' min={0} max={9} required />
            </div>

            <div className='btns'>
            <Button  variant='contained' onClick={handleRecieve} style={{backgroundColor:'#295f87'}} fullWidth={true} endIcon={<GroupAddIcon/>}>Join Room</Button>
       
        </div>
        {/* <h2>Recieve</h2>
        <OutlinedInput
            id=""
            endAdornment={<InputAdornment position="end"><FileDownloadIcon/></InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
          />
         */}
        
        </div>
    </>
  )
}

export default Recievebox