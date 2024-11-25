import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../common/layout/App";
import HomePage from "../../features/home/HomePage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import CreatePage from "../../features/create/CreatePage";
import OtherPage from "../../features/other/OtherPage";
import BvtPage from "../../features/create/bvt/BvtPage";
import ManPage from "../../features/create/man/ManPage";
import PerfPage from "../../features/create/perf/PerfPage";
import AltPage from "../../features/create/alt/AltPage";
import DeletePage from "../../features/delete/DeletePage";
import InsertPage from "../../features/other/insert/InsertPage";
import MedianPage from "../../features/other/median/MedianPage";
import GroupPage from "../../features/delete/group/GroupPage";
import Signal from "../../features/other/signalR/Signal";
import LoginPage from "../../features/login/LoginPage";
import RegisterPage from "../../features/login/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      {
        path: "create",
        element: <CreatePage />,
        children: [
          { path: "bvt", element: <BvtPage /> },
          { path: "man", element: <ManPage /> },
          { path: "perf", element: <PerfPage /> },
          { path: "alt", element: <AltPage /> },
        ],
      },
      {
        path: "delete",
        element: <DeletePage />,
        children: [{ path: "group", element: <GroupPage /> }],
      },
      {
        path: "other",
        element: <OtherPage />,
        children: [
          { path: "insert", element: <InsertPage /> },
          { path: "median", element: <MedianPage /> },
          { path: "signal", element: <Signal /> },
        ],
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> }, //404
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
