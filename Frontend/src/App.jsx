import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login'
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />
	},
	{
		path: "/Dashboard",
		element: <Dashboard/>
	},
	
]);

function App() {
  return (
    <div className="App">
			<RouterProvider router={router} />
		</div>
  );
}

export default App;