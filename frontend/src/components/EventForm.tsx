import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
    TextField,
    MenuItem,
    Button,
    Stack,
    Alert,
} from "@mui/material";
import { GET_LOCATIONS } from "../graphql/queries";

interface LocationInfo {
    value: string;
    label: string;
}

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
    }) => void | Promise<void>;
    submitLabel: string;
    submitting?: boolean;
}

function toDatetimeLocal(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
}

export default function EventForm({
    initial,
    onSubmit,
    submitLabel,
    submitting = false,
}: EventFormProps) {
    const { data } = useQuery<{ locations: LocationInfo[] }>(GET_LOCATIONS);
    const locations = data?.locations ?? [];

    const [title, setTitle] = useState(initial?.title ?? "");
    const [location, setLocation] = useState(initial?.location ?? "");
    const [startDate, setStartDate] = useState(
        initial?.startDate ? toDatetimeLocal(initial.startDate) : ""
    );
    const [endDate, setEndDate] = useState(
        initial?.endDate ? toDatetimeLocal(initial.endDate) : ""
    );
    const [formError, setFormError] = useState("");

    // Default to first location once loaded
    const effectiveLocation = location || (locations.length > 0 ? locations[0].value : "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            setFormError("Please provide valid start and end dates");
            return;
        }

        if (start >= end) {
            setFormError("Start date must be before end date");
            return;
        }

        if (!effectiveLocation) {
            setFormError("Please select a location");
            return;
        }

        setFormError("");
        await onSubmit({
            title: title.trim(),
            location: effectiveLocation,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 1 }}>
                {formError && <Alert severity="error">{formError}</Alert>}
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Location"
                    value={effectiveLocation}
                    onChange={(e) => setLocation(e.target.value)}
                    select
                    fullWidth
                >
                    {locations.map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                            {label}
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
                <Button type="submit" variant="contained" disabled={submitting}>
                    {submitLabel}
                </Button>
            </Stack>
        </form>
    );
}