
import { useState, useEffect } from "react";
import { Company } from "../../common/models/company"
import CompanyList from "./CompanyList"
import agent from "../../app/api/agent";
import LoadingComponent from "../../common/components/CustomLoading";
import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Paper, Radio, RadioGroup, TextField } from "@mui/material";

const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' },
    { value: 'price', label: 'Price' },
    // Add more sort options as needed
  ];
export default function Create() {
    const [data, setData] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       agent.Company.list()
       .then(data=> setData(data))
       .catch(error => console.log(error))
       .finally(() => setLoading(false)) 
    },[])

    if(loading) return <LoadingComponent message="Loading companies..."/>

    return(
        <Grid container spacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb:2}}>
                    <TextField 
                    label="Company Name" 
                    variant="outlined" 
                    fullWidth />
                </Paper>  
                <Paper sx={{mb:2,p:2}}>
                    <FormControl component="fieldset">
                    <RadioGroup>
                        {sortOptions.map(({value,label}) => (
                            <FormControlLabel value={value} control={<Radio />} label={label} />
                        ))}
                    </RadioGroup>
                    </FormControl>

                </Paper> 
                <Paper sx={{mb:2,p:2}}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                    <FormControlLabel required control={<Checkbox />} label="Required" />
                    <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                </FormGroup> 
                </Paper> 
            </Grid> 
            <Grid item xs={9}>
                <CompanyList data={data}/>
            </Grid>  
        </Grid>
    )   
}