import logo from '../logo.svg'
import './App.css';
import { useEffect, useState, useContext, useRef }  from 'react'
import { createRoot } from "react-dom/client";
import WebFont from 'webfontloader';
import DynamicContainer  from '../components/main/DynamicContainer'
import ChatSidebar from '../components/sidebar/ChatSidebar'
import Hero from '../components/hero/Hero';
import UserInput from '../components/userinput/UserInput'
import { styled, Box, TextField, Typography } from '@mui/material'
import Chart from '../components/chart/Chart';
import DataProvider from "../components/context/DataProvider"
import IconButton from '@mui/material/IconButton';
import TelegramIcon from '@mui/icons-material/Telegram';
import { DataContext } from '../components/context/DataProvider';
import { chatResponse } from '../langchain/LangChain';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import GlobalPromiseQueue from '../GlobalPromiseQueue/GlobalPromiseQueue';

const Container = styled(DynamicContainer)
` background-color: white;`; 




function App() {
  const chatMsgRef = useRef(null);
  const [chatMsg, setChatMsg] = useState('')
  const {reqState, setReqState} = useContext(DataContext)
  
  const chatMsgChange = (e) => {
    setChatMsg(e.target.value); 
  }

  const updateContent = async (content) => {
    if(content != '' & !reqState)
    {
      chatMsgRef.current.value = '';
      const element = document.createElement("div");
      createRoot(element).render(chatContainer(content, 'human' ))
      const container = document.getElementById("response-section");
      container.appendChild(element);

      setReqState(true) 
      await chatResponse(content)
        .then(res => {
          const element = document.createElement("div");
          createRoot(element).render(chatContainer(res.response, 'robot'))
          container.appendChild(element);
          setReqState(false)
        })
        .catch( err => {
          setReqState(false)
          alert.children[0].innerHTML = err;
        })
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      GlobalPromiseQueue.enqueue(async () => {await updateContent(chatMsg)});
    }
  };

  const chatContainer = (text, Icon) => {
    return (
      Icon == 'human'? 
        <DynamicContainer sx={{ p: '8px 10px', display: 'flex', alignItems: 'center', width: 'fit-content', marginLeft: 'auto' }}>
          <Typography sx={{width: '95%'}}>{text}</Typography>
          <IconButton type="button" sx={{ p: '10px' }} aria-label="icon"> 
            <PersonIcon color='primary' /> 
          </IconButton>
        </DynamicContainer>
      : ( 
        <DynamicContainer sx={{ p: '8px 10px', display: 'flex', alignItems: 'center', width: 'fit-content' }}>
          <IconButton type="button" sx={{ p: '10px' }} aria-label="icon"> 
            <SmartToyIcon color='secondary'/>
          </IconButton>
          <Typography sx={{width: '95%'}}>{text}</Typography>
        </DynamicContainer>
        )
    )
  }

  return (
    <>
      <Hero />
      <Box id="main-container">
        <Box id="response-section">
        </Box>
        <DynamicContainer id="chat-box" sx={{ p: '8px 10px', display: 'none', alignItems: 'center' }}>
          <TextField fullWidth label="Chit Chat with Resume Bot" color="primary" inputRef={chatMsgRef} onKeyDown={handleKeyDown} onChange={(e)=>chatMsgChange(e)}/>
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={(e)=> GlobalPromiseQueue.enqueue(async () => {await updateContent(chatMsg)})}>
            <TelegramIcon />
          </IconButton>
        </DynamicContainer>
        <DynamicContainer id="some" >
          <UserInput />
        </DynamicContainer>
      </Box>
    </>
  );
}

export default App;
