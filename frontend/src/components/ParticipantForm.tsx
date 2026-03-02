import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

interface ParticipantFormProps {
    onSubmit: (email: string) => void | Promise<void>;
    submitting?: boolean;
}

export default function ParticipantForm({
    onSubmit,
    submitting = false,
}: ParticipantFormProps) {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            try {
                await onSubmit(email.trim());
                setEmail("");
            } catch {
                // Error state is handled by parent page; keep input value for quick retry.
            }
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
                    disabled={submitting}
                />
                <Button type="submit" variant="outlined" size="medium" disabled={submitting}>
                    Add
                </Button>
            </Stack>
        </form>
    );
}