import React from "react";
import {Box,TextField,Button,styled,Typography} from '@mui/material';
import Roboto  from '@fontsource/roboto'
import './Hero.css'

const Hero = () => {
  return (
    <Box className="hero-section">
      <Typography variant="h1" id="main-title">AI Resume Bot with ChatGPT</Typography>
      <Typography id="sub-title">Lets Create Resume that fits your desired Job</Typography>
    </Box>
  )
}

export default Hero;