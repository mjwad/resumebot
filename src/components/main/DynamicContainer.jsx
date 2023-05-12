import * as React from 'react';
import Card from '@mui/material/Card';
import { styled } from '@mui/material';


const Container = styled(Card)
` 
    height: fit-content;
    margin-left: 24px;
    margin-right: 24px;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    display: flex;
    flex-direction: column;
    position: relative;
    background-clip: border-box;
    border: 0 solid rgba(0, 0, 0, 0.125);
    border-radius: 0.75rem;
    padding: 16px;
    margin-top: 20px;
    margin-bottom: 32px;
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0rem 1.25rem 1.6875rem 0rem rgb(0 0 0 / 20%);
    backdrop-filter: saturate(200%) blur(30px);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    white-space: pre-wrap;
`


export default function DynamicContainer( props) {
  return (
    <Container className='container' id={props.id} sx={props.sx}>
      {props.children}
    </Container>
  );
}   