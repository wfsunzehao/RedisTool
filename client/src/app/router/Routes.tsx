import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/create/Create";
import CompanyDetail from "../../features/create/CompanyDetail";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import Test from "../../features/test/Test";
import CreatePage from "../../features/test/CreatePage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children:[
            {path: '',element: <HomePage/>},
            {path: 'catalog',element: <Catalog/>},
            {path: 'catalog/:id',element: <CompanyDetail/>},
            {path: 'about',element: <AboutPage/>},
            {path: 'contact',element: <ContactPage/>},
            {path: 'test',element: <CreatePage/>},
            {path: 'server-error',element: <ServerError/>},
            {path: 'not-found',element: <NotFound/>}, //404
            {path: '*',element: <Navigate replace to ='/not-found'/>} 
        ]
    }
])