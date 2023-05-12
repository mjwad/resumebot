import { createRoot } from "react-dom/client";
import DynamicContainer  from '../main/DynamicContainer';
import Chart from '../chart/Chart';
import { chatResponse } from "../../langchain/LangChain";
import { DataContext } from "../context/DataProvider";
import { useContext } from "react";
import GlobalPromiseQueue from "../../GlobalPromiseQueue/GlobalPromiseQueue";

const addContainer = (cont) => {
  const element = document.createElement("div");
  createRoot(element).render(cont)
  const container = document.getElementById("response-section");
  container.appendChild(element);
}

const ChartContainer = (props) => {
  const { skillSet } = props;
  let mactchedscore = 0;
  let numberofSkills = 0;
  
  skillSet.forEach(element => {
    numberofSkills++;
    
    if(element.value == 1)
    { mactchedscore++; }
  });

  const matchedPercent = mactchedscore / numberofSkills;
  const unmatchedPercent = 1 - matchedPercent;
  const data = [
    { name: 'Matched', value: matchedPercent * 100 },
    { name: 'Missing', value: unmatchedPercent * 100 }
  ];

  return (
    <DynamicContainer >
      <Chart data={data} skillset={skillSet}/>
    </DynamicContainer>
  )
}

const GeneralContainer = (props) => {
  return (
    <DynamicContainer >
      <section>
        <h2>{props.heading}</h2>
        <p>{props.content}</p>
      </section>
    </DynamicContainer>
  )
}

let cvFormat = `
                                             Christine Smith
            344 ELM STREET MADISON, SD 57042  #  +1 (970) 333-3833  #  christine.smith@mail.com
Summary
  Motivated cashier who is highly energetic, outgoing and detail-oriented. Handles multiple responsibilities simultaneously while providing exceptional customer service. Quickly learns and masters new concepts and skills. Passionate about ensuring customers leave shop with a positive experience.
  Highlights
    • Cash handling accuracy
    • Loss prevention
    • Mathematical aptitude
    • Organized
Experience
  CASHIER - 09/2017 to 05/2019
  SEARS - SHOP, New York
    • Offer exceptional customer service to differentiate and promote the company brand.
    • Cooperate with customer service team members to give exceptional service throughout the entire shopping and purchasing experience.
    • Keep checkout line clean at all times and maintain neat, orderly product displays.
    • Mentor and coach new cashiers.

  CASHIER - 09/2015 to 05/2016
  SEARS - SHOP, New York
    • Offer exc5eptional customer service to differentiate and promote the company brand.
    • Cooperate with customer service team members to give exceptional service throughout the entire shopping and purchasing experience.
    • Keep checkout line clean at all times and maintain neat, orderly product displays.
    • Mentor and coach new cashiers.

Education
Bachelor of Science:   Business Communication and Business Administration - 2014
Rohan Community College, NY
`
export const processInput = async (jd, cv, type, reqState, setReqState) => {

  let alert = document.getElementsByClassName('alert')[0];
  let info = document.getElementsByClassName('info')[0];
  
  if(jd !== '' && cv !== '')
  {
    alert.classList.remove('visible');
    info.classList.remove('visible');
    
    document.getElementsByClassName('progress-bar')[0].classList.add('visible');
    
    if(type == "resume" && !reqState ) { GlobalPromiseQueue.enqueue(async () => {await addFormattedResume(cv, setReqState)})}
    else if(type == "coverletter" && !reqState ) { GlobalPromiseQueue.enqueue(async () => {await addCoverLetter(jd, cv, setReqState)}) }
    else if(type == "chat" && !reqState) { GlobalPromiseQueue.enqueue(async () => {await addchart_chat(jd, cv, setReqState)}) }
  
  } else  {
    setReqState(false);
    alert.classList.add('visible')
    alert.children[0].innerHTML = "Job Description or Resume Content can't be empty"
    return
  } 
}

const addFormattedResume = async (cv, setReqState) => {
  setReqState(true);
  let alert = document.getElementsByClassName('alert')[0];
  let info = document.getElementsByClassName('info')[0];
  let template = `please format the candidate's resume according to the below template: \n \`\`\` "${cvFormat}"\`\`\``+
   `by following its section headings and content, regardless of the candidate's profession.`+
   `After formatting, enclose the resulting resume within code blocks using three backticks \`\`\` on a new line,`+
   `and then another three backticks on a new line.`;
  await chatResponse(template)
    .then(res => {
      const formatedResume = res.response.match(/```(.*)```/s)

      if(formatedResume != null)
      {
        addContainer(<GeneralContainer heading={"Formatted Resume"} content={formatedResume[1]} />)
        window.scrollTo(0, document.documentElement.scrollHeight);
      } else {
        info.classList.add('visible');
        info.children[0].innerHTML = res.response;
      }
      document.getElementsByClassName('progress-bar')[0].classList.remove('visible')
      setReqState(false);
    })
    .catch( err => {
      setReqState(false);
      document.getElementsByClassName('progress-bar')[0].classList.remove('visible')
      alert.classList.add('visible');
      alert.children[0].innerHTML = err;
    })
}

const addCoverLetter = async (jd, cv, setReqState) => {
  setReqState(true);
  let alert = document.getElementsByClassName('alert')[0];
  let info = document.getElementsByClassName('info')[0];
  let template =  `Write a cover letter by analayzing the job requirements and responsibilities in job description`+
    `and the candidate resume provided you in coversation.Cover letter must be enclosed like:  \`\`\` \n coverletter \n \`\`\``;

  await chatResponse(template)
    .then(res => {
      const coverLetter = res.response.match(/```(.*)```/s)

      if(coverLetter != null)
      {
        addContainer(<GeneralContainer heading={"Cover Letter"} content={coverLetter[1]} />)
        window.scrollTo(0, document.documentElement.scrollHeight);
      } else {
        info.classList.add('visible');
        info.children[0].innerHTML = res.response;
      }
      document.getElementsByClassName('progress-bar')[0].classList.remove('visible')
      setReqState(false);
    })
    .catch( err => {
      setReqState(false);
      document.getElementsByClassName('progress-bar')[0].classList.remove('visible')
      alert.classList.add('visible');
      alert.children[0].innerHTML = err;
    })
}

const addchart_chat = async (jd, cv, setReqState) => {
  const element =  document.getElementById('chat-box');
  if (element) {
    element.style.visibility = 'visible';
    element.style.display = 'flex';
  }
  setReqState(true);
  let alert = document.getElementsByClassName('alert')[0];
  let info = document.getElementsByClassName('info')[0];
  let template =  `Analayze the job requirements and responsibilities in job description provided you earlier in conversation`+
    `and evaluate how much candidate fit to job based on resume, get required skills from job description not from resume\n`+
    `and return in array of hashes one value for skill and other for value that should be 1 if skill required in job description is present in cv else 0`+
    `please format array like [{\"skill\": \"word\", \"value\": 1}]` +
    `just do it don't ask for confirmation!`;

  await chatResponse(template)
    .then( res=> {
      const arr = res.response.match(/\[(.*)\]/s)
      if(arr != null)
      {
        addContainer(<ChartContainer skillSet={JSON.parse(arr[0])}/>);
        window.scrollTo(0, document.documentElement.scrollHeight);
      } else {
        info.classList.add('visible');
        info.children[0].innerHTML = res.response;
      }
      document.getElementsByClassName('progress-bar')[0].classList.remove('visible')
      setReqState(false);
    })
    .catch(
      err => {
        setReqState(false);
        document.getElementsByClassName('progress-bar')[0].classList.remove('visible')
        alert.classList.add('visible');
        alert.children[0].innerHTML = err;
      }
    )
}







