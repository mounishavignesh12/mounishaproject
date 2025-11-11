import { createBrowserRouter, RouterProvider  } from "react-router-dom";
import Layout from "./Layout";
import Form from "./forms/CreatableForm/Form";

const App = () => {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <Layout/>
    },
    {
      path: "/form",
      element: <Form/>
    }
  ],{
    future: {
      v7_relativeSplatPath: true
    }
  })
  return (
    <RouterProvider router={router}/>
  );
};

export default App;
