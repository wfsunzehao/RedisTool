
import { useState, useEffect } from "react";
import { Company } from "../../app/models/company"
import CompanyList from "./CompanyList"
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
export default function Catalog() {
    const [data, setData] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       agent.Catalog.list()
       .then(data=> setData(data))
       .catch(error => console.log(error))
       .finally(() => setLoading(false)) 
    },[])

    if(loading) return <LoadingComponent message="Loading companies..."/>

    return(
        <>
        <CompanyList data={data}/>
        </>
    )   
}