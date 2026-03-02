import { useState } from "react";
import {
    TextField,
    MenuItem,
    Button,
    Stack,
} from "@mui/material";

const LOCATIONS = ["CORINTHIA_BUDAPEST", "HEMINGWAY_ETTEREM", "BOSCOLO", "PESTI_VIGADO", "GUNDEL_ETTEREM", "VAJDAHUNYAD_VAR", "BALATONFURED_KONGRESSZUSI_KOZPONT", "OBOLHAZ_RENDEZVENYKOZPONT"];

interface EventFormProps {
    initial?: {
        title: string;
        location: string;
        startDate: string;
        endDate: string;
    };
    onSubmit: (data: {
        title: string;
        location: string;
        startDate: string;
        endDate: string;
    }) => void;
    submitLabel: string;
}

function toDatetimeLocal(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
}

export default function EventForm({ initial, onSubmit, submitLabel }: EventFormProps) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [location, setLocation] = useState(initial?.location ?? LOCATIONS[0]);
    const [startDate, setStartDate] = useState(
        initial?.startDate ? toDatetimeLocal(initial.startDate) : ""
    );
    const [endDate, setEndDate] = useState(
        initial?.endDate ? toDatetimeLocal(initial.endDate) : ""
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            location,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    select
                    fullWidth
                >
                    {LOCATIONS.map((loc) => (
                        <MenuItem key={loc} value={loc}>
                            {loc}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Start Date"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    label="End Date"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <Button type="submit" variant="contained">
                    {submitLabel}
                </Button>
            </Stack>
        </form>
    );
}