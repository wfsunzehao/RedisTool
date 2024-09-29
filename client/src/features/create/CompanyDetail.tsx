import { Button, Divider, Grid, Grid2, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useState,useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Company } from "../../app/models/company";
import axios from "axios";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function CompanyDetail() {
  const {id} = useParams<{id:string}>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Catalog.details(parseInt(id))
    .then(response => { setCompany(response);})
    .catch(error => console.log(error.response))
    .finally(() => setLoading(false));
  },[id])

 

  if (loading) return <LoadingComponent message="Loading company..."/>

  if (!company) return <NotFound/>


  
  return(
    <Grid2 container spacing={6}>
      <Grid2 item xs={6}>
          <img src={"http://picsum.photos/id/1018/200/300"} alt={company.name} style={{width:'100%'}}/>
      </Grid2>
      <Grid2 item xs={6}>
          <Typography variant="h2" component="h2" sx={{textAlign: 'center'}}>{company.name}</Typography>
          <Divider sx={{marginBottom: 2}}/>
          <Typography variant="h4" component="h4" sx={{textAlign: 'center'}} color="secondary.main">{company.address}</Typography>
          <TableContainer>
              <Table>
                 <TableBody>
                    <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell>{123}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{'wf@gmail.com'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Website</TableCell>
                      <TableCell>{'www.XX.com'}</TableCell>
                    </TableRow>
                 </TableBody>
              </Table>
              <Button fullWidth component={Link} to='/catalog'>Go back</Button>
          </TableContainer>
      </Grid2>
    </Grid2>
  )
}
