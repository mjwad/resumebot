import * as React from 'react';
import { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ButtonBase, styled } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { 
  TextField,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle
 } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { processInput } from '../processData/processData' 
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import './UserInput.css'
import { chatResponse } from "../../langchain/LangChain";
import { DataContext } from '../context/DataProvider';
import GlobalPromiseQueue from '../../GlobalPromiseQueue/GlobalPromiseQueue';
//handling to pre load cv and jd//09 May 2023

const Input = styled('input')({
  marginLeft: '-87px'
})

// const useStyles = makeStyles((theme) => ({
//   uploadButton: {
//     margin: 0,
//   },
// }));
// const classes = useStyles();



export default function UserInput() {
  const [cv, setCv] = useState('');
  const [jd, setJd] = useState('');
  const [fileName, setFileName] = useState('');
  const jdTemplate = `You have been given updated job description as follows: - \n\`\`\`${jd}\`\`\` \n` +
    `remember it, in upcoming conversation I shall ask question in it, from you`;
  

  const {reqState, setReqState} = useContext(DataContext)

  let alert = document.getElementsByClassName('alert')[0];
  let info = document.getElementsByClassName('info')[0];

  const cvChange = async (e) => {
      e.preventDefault();
      const file = e.target.files[0];

      setFileName(file.name);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const content = e.target.result;
        var doc = new Docxtemplater(new PizZip(content), {delimiters: {start: '12op1j2po1j2poj1po', end: 'op21j4po21jp4oj1op24j'}});
        var text = doc.getFullText().replace(/\n/g, '<br>');
        setCv(text)
        const cvTemplate = `You have been given updated resume of candidate as follows: - \n\`\`\`${text}\`\`\` \n` +
          `remember it, in upcoming conversation I shall ask question in it, from you`;
        GlobalPromiseQueue.enqueue(async () => { await updateContent(text, cvTemplate) });
      };
      reader.readAsBinaryString(file);
  };

  const jdChange = (event) => {
    setJd(event.target.value);
  }

  const updateContent = async (content, template) => {
    if(content != '')
    {
      setReqState(true) 
      await chatResponse(template)
        .then(res => {
          info.classList.add('visible');
          info.children[0].innerHTML = res.response;
          setReqState(false)
        })
        .catch( err => {
          setReqState(false)
          alert.classList.add('visible');
          alert.children[0].innerHTML = err;
        })
    }
  }


  return(
    <>
      <section className="progress-bar">
        <CircularProgress />
      </section>
      <Grid container >
        <section className='info'>
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            This is an info alert — <strong>check it out!</strong>
          </Alert>
        </section>
        <section className="alert">
          <Alert variant="filled" severity="error" id="alert">
            This is an error alert — check it out!
          </Alert>
        </section>
        <Grid item container spacing={3}>
          <Grid item xs={12} sm={9}>
            <Typography variant="h6" gutterBottom>
              Job Description:
            </Typography>
            <br />
            <TextField
              id="text-input"
              label="Text Input"
              multiline
              rows={8}
              placeholder="Paste Job Description here..."
              fullWidth
              inputProps={{ maxLength: 1200 }}
              value={jd}
              helperText={`You have entered ${jd.length} / 1200 characters.`}
              onChange={(e)=>jdChange(e)}
              onBlur={(e)=> GlobalPromiseQueue.enqueue(async () => { await updateContent(jd, jdTemplate)})}
            />
          </Grid>
          <Grid item container xs={12} sm={3} direction="column" justifyContent="space-between" id="left" textAlign="center">
            <Grid item xs={12} sm={2}>
              <Typography variant="h6" gutterBottom>
                Upload Your Resume:
              </Typography>
              <input
                accept=".doc, .docx"
                onChange={(e) => cvChange(e)}
                id="contained-button-file"
                type="file"
                style={{ display: 'none' }}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span" startIcon={<CloudUploadIcon color="secondry" />}>
                <span style={{ textTransform: 'lowercase' }}>
                  {fileName ? fileName.substr(0, 17) + '...' : 'Upload File (.doc, .docx)'}
                </span>
                </Button>
               </label>
            </Grid>
            <Grid item xs={12} sm={2} id="submit">
              <Button
                variant="outlined"
                component="span"
                onClick={ (e) => processInput(jd, cv, "resume", reqState, setReqState) }
                >
                Get Formated Resume
              </Button>
            </Grid>
            <Grid item xs={12} sm={2} id="submit">
              <Button
                variant="outlined"
                component="span"
                onClick={ (e) => processInput(jd, cv, "coverletter", reqState, setReqState) } 
                >
                Get Cover Letter
              </Button>
            </Grid>
            <Grid item xs={12} sm={2} id="submit">
              <Button
                component="span"
                onClick={ (e) => processInput(jd, cv, "chat", reqState, setReqState) }
                startIcon={<SmartToyIcon />}
                color="secondary" >
                  <span style={{ textTransform: 'capitalize' }}>
                    Let's have a Chat! 
                  </span>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}