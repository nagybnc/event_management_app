import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

interface ParticipantFormProps {
    onSubmit: (email: string) => void;
}

export default function ParticipantForm({ onSubmit }: ParticipantFormProps) {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            onSubmit(email.trim());
            setEmail("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    label="Participant Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    size="small"
                />
                <Button type="submit" variant="outlined" size="medium">
                    Add
                </Button>
            </Stack>
        </form>
    );
}