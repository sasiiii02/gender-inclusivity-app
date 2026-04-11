import { Toaster } from "react-hot-toast";
import { BrowserRouter, useInRouterContext } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const isInsideRouter = useInRouterContext();

  if (isInsideRouter) {
    return (
      <>
        <Toaster position="top-right" />
        <AppRoutes />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>

  );
}

export default App;