import { AppProvider } from "./data/AppContext";
import Navigation from "./screens/Navigation";

export default function App() {
  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
}
