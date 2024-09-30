
import { useState, useEffect } from "react";
import { Company } from "../../app/models/company"
import CompanyList from "./CompanyList"
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Grid2, Paper, TextField } from "@mui/material";
export default function Create() {
    const [data, setData] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       agent.Create.list()
       .then(data=> setData(data))
       .catch(error => console.log(error))
       .finally(() => setLoading(false)) 
    },[])

    if(loading) return <LoadingComponent message="Loading companies..."/>

    return(
        <Grid2 container spacing={4}>
            <Grid2 item xs={3}>
                <Paper sx={{mb:2}}>
                    <TextField 
                    label="Company Name" 
                    variant="outlined" 
                    fullWidth />
                </Paper>                
            </Grid2> 
            <Grid2 item xs={9}>
                <CompanyList data={data}/>
            </Grid2>  
        </Grid2>
    )   
}