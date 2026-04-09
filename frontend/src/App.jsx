import { BrowserRouter, useInRouterContext } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const isInsideRouter = useInRouterContext();

  if (isInsideRouter) {
    return <AppRoutes />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;