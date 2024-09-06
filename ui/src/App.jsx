import React from 'react'
import Possession from './Header/Possession'
import UpdatePossession from "./Pages/UpdatePossession";
import CreatePossession from './Pages/CreatePossession'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from './Header/Menu';
import Patrimoine from './Header/Patrimoine';

const possessionRoutes = [
  { path: ":libelle/close", element: <Possession /> },
];

const patrimoineRoutes = [
  { path: ":date", element: <Patrimoine /> },
  { path: "range", element: <Patrimoine /> },
];

const ROUTER = createBrowserRouter([
  {
    path: "/possession",
    element: <Possession />,
    children: possessionRoutes,
  },
  {
    path: "/possession/create",
    element: <CreatePossession />,
  },
  {
    path: "/possession/:libelle/update",
    element: <UpdatePossession />,
  },
  {
    path: "/patrimoine",
    element: <Patrimoine />,
    children: patrimoineRoutes,
  },
  {
    path: "*",
    element: <Menu />,
  },
]);

export default function App() {
  return (
    <RouterProvider router={ROUTER} />
  )
}