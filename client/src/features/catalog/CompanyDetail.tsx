import { Divider, Grid, Grid2, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { Company } from "../../app/models/company";
import axios from "axios";

export default function CompanyDetail() {
  const {id} = useParams<{id:string}>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://localhost:7179/api/Company/${id}`)
    .then(response => { setCompany(response.data);})
    .catch(error => console.log(error))
    .finally(() => setLoading(false));
  },[id])

  if(loading) return <Typography variant="h2" component="h2" sx={{textAlign: 'center'}}>
    Loading...
  </Typography>


  if(!company) return <Typography variant="h2" component="h2" sx={{textAlign: 'center'}}>
    Company Not Found
  </Typography>

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
          </TableContainer>
      </Grid2>
    </Grid2>
  )
}
