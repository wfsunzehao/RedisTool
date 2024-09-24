
import { useState, useEffect } from "react";
import { Company } from "../../app/models/company"
import CompanyList from "./CompanyList"
export default function Catalog() {
    const [data, setData] = useState<Company[]>([]);
   

    useEffect(() => {
       fetch('https://localhost:7179/api/Company')
         .then((response) => response.json())
        .then((data) => setData(data));
    },[])
    return(
        <>
        <CompanyList data={data}/>
        </>
    )   
}