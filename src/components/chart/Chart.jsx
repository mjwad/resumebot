import { PieChart, Pie, Sector, Cell } from 'recharts';
import { styled, Grid, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './Chart.css'

const COLORS = ['#0088FE', '#FFBB28'];
const RADIAN = Math.PI / 180;

const Checked = styled(CheckIcon)
`color: blue;`
const NotChecked = styled(CloseIcon)
`color: red;`

const Chart = (props) => {
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const txtX = (x) + (radius+10)* Math.cos(-midAngle * RADIAN);
    const txtY = (y) + (radius+10)* Math.sin(-midAngle * RADIAN);
    return (
      <>
        <text x={txtX} y={txtY} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${props.data[index].name}`}
        </text>
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
      
    );
  };
    return (
      <Grid  container xs={12} sm={12}>
        <Grid item xs={12} sm={6}>
          <Typography id="skill-heading" variant="h4" gutterBottom>
            Skills
          </Typography>
          <ul>
          {props.skillset.map((entry, index) => (
            <li>{entry.skill} {entry.value === 1 ? <Checked /> : <NotChecked />}</li>
          ))}
          </ul>
          
        </Grid>
        <Grid item xs={12} sm={6}>
          <PieChart width={350} height={350}>
            <Pie
              data={props.data}
              cx={200}
              cy={150}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              className="custom-pie"
            >
              {props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </Grid>
        
      </Grid>
    );
}


export default Chart;