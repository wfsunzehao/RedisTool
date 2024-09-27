
import { useState, useEffect } from "react";
import { Company } from "../../app/models/company"
import CompanyList from "./CompanyList"
import agent from "../../app/api/agent";
export default function Catalog() {
    const [data, setData] = useState<Company[]>([]);
   

    useEffect(() => {
       agent.Catalog.list().then(data=> setData(data))
    },[])
    return(
        <>
        <CompanyList data={data}/>
        </>
    )   
}