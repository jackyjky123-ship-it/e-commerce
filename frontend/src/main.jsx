import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource/rubik/400.css"
import "@fontsource/rubik/500.css"
import "@fontsource/rubik/600.css"
import "@fontsource/rubik/700.css"
import "@fontsource/rubik/800.css"
import "@fontsource/nunito-sans/400.css"
import "@fontsource/nunito-sans/600.css"
import "@fontsource/nunito-sans/700.css"
import "./index.css"
import App from "./App.jsx"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
)