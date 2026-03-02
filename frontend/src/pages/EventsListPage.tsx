import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
    Container,
    Typography,
    Grid2 as Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Alert,
    AppBar,
    Toolbar,
} from "@mui/material";
import { GET_EVENTS, GET_LOCATIONS } from "../graphql/queries";
import { CREATE_EVENT, DELETE_EVENT } from "../graphql/mutations";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";

interface EventListItem {
    id: string;
    title: string;
    status: string;
    location: string;
    startDate: string;
    endDate: string;
    participants: { id: string }[];
}

interface EventsQueryData {
    events: EventListItem[];
}

interface LocationsQueryData {
    locations: Array<{ value: string; label: string }>;
}

export default function EventsListPage() {
    const { data, loading, error } = useQuery<EventsQueryData>(GET_EVENTS);
    const { data: locData } = useQuery<LocationsQueryData>(GET_LOCATIONS);
    const locationLabels: Record<string, string> = Object.fromEntries(
        (locData?.locations ?? []).map((l) => [l.value, l.label])
    );
    const [createEvent, { loading: creating }] = useMutation(CREATE_EVENT, {
        refetchQueries: [{ query: GET_EVENTS }],
    });
    const [deleteEvent] = useMutation(DELETE_EVENT, {
        refetchQueries: [{ query: GET_EVENTS }],
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleCreate = async (formData: {
        title: string;
        location: string;
        startDate: string;
        endDate: string;
    }) => {
        try {
            await createEvent({ variables: { input: formData } });
            setDialogOpen(false);
            setErrorMsg("");
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Failed to create event");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent({ variables: { id } });
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Failed to delete event");
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Event Manager
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 3 }}>
                {errorMsg && (
                    <Alert severity="error" onClose={() => setErrorMsg("")} sx={{ mb: 2 }}>
                        {errorMsg}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    onClick={() => setDialogOpen(true)}
                    sx={{ mb: 3 }}
                    disabled={creating}
                >
                    Create Event
                </Button>

                {loading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">{error.message}</Typography>}

                <Grid container spacing={2}>
                    {data?.events.map((event) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
                            <EventCard
                                event={event}
                                locationLabels={locationLabels}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Create Event</DialogTitle>
                    <DialogContent>
                        <EventForm
                            onSubmit={handleCreate}
                            submitLabel="Create"
                            submitting={creating}
                        />
                    </DialogContent>
                </Dialog>
            </Container>
        </>
    );
}