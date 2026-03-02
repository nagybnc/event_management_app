import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsListPage from "./pages/EventsListPage";
import EventDetailPage from "./pages/EventDetailPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EventsListPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
}