import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
    Container,
    Typography,
    Button,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
    Stack,
    Divider,
    Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { GET_EVENT } from "../graphql/queries";
import {
    UPDATE_EVENT,
    ADD_PARTICIPANT,
    REMOVE_PARTICIPANT,
} from "../graphql/mutations";
import EventForm from "../components/EventForm";
import ParticipantForm from "../components/ParticipantForm";
import { useState } from "react";

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, loading, error } = useQuery(GET_EVENT, {
        variables: { id },
    });

    const [updateEvent] = useMutation(UPDATE_EVENT);
    const [addParticipant] = useMutation(ADD_PARTICIPANT, {
        refetchQueries: [{ query: GET_EVENT, variables: { id } }],
    });
    const [removeParticipant] = useMutation(REMOVE_PARTICIPANT, {
        refetchQueries: [{ query: GET_EVENT, variables: { id } }],
    });

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    if (loading) return <Typography sx={{ m: 3 }}>Loading...</Typography>;
    if (error)
        return (
            <Typography color="error" sx={{ m: 3 }}>
                {error.message}
            </Typography>
        );
    if (!data?.event) return <Typography sx={{ m: 3 }}>Event not found</Typography>;

    const event = data.event;

    const handleUpdate = async (formData: {
        title: string;
        location: string;
        startDate: string;
        endDate: string;
    }) => {
        try {
            await updateEvent({
                variables: { id, input: formData },
                refetchQueries: [{ query: GET_EVENT, variables: { id } }],
            });
            setErrorMsg("");
            setSuccessMsg("Event updated");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Failed to update");
        }
    };

    const handlePublish = async () => {
        try {
            await updateEvent({
                variables: { id, input: { status: "PUBLISHED" } },
                refetchQueries: [{ query: GET_EVENT, variables: { id } }],
            });
            setErrorMsg("");
            setSuccessMsg("Event published! Notification emails queued.");
            setTimeout(() => setSuccessMsg(""), 5000);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Failed to publish");
        }
    };

    const handleAddParticipant = async (email: string) => {
        try {
            await addParticipant({
                variables: { input: { eventId: id, email } },
            });
            setErrorMsg("");
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Failed to add participant");
        }
    };

    const handleRemoveParticipant = async (participantId: string) => {
        try {
            await removeParticipant({ variables: { id: participantId } });
        } catch (err: unknown) {
            setErrorMsg(
                err instanceof Error ? err.message : "Failed to remove participant"
            );
        }
    };

    return (
        <Container sx={{ mt: 3, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                sx={{ mb: 2 }}
            >
                Back to Events
            </Button>

            {successMsg && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMsg}
                </Alert>
            )}
            {errorMsg && (
                <Alert severity="error" onClose={() => setErrorMsg("")} sx={{ mb: 2 }}>
                    {errorMsg}
                </Alert>
            )}

            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Typography variant="h4">{event.title}</Typography>
                <Chip
                    label={event.status}
                    color={event.status === "PUBLISHED" ? "success" : "default"}
                />
            </Stack>

            {event.status === "DRAFT" && (
                <Button
                    variant="contained"
                    color="success"
                    onClick={handlePublish}
                    sx={{ mb: 3 }}
                >
                    Publish Event
                </Button>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Edit Event
                </Typography>
                <EventForm
                    initial={{
                        title: event.title,
                        location: event.location,
                        startDate: event.startDate,
                        endDate: event.endDate,
                    }}
                    onSubmit={handleUpdate}
                    submitLabel="Save Changes"
                />
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Participants ({event.participants.length})
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <ParticipantForm onSubmit={handleAddParticipant} />
                </Box>

                <Divider />

                {event.participants.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                        No participants yet
                    </Typography>
                ) : (
                    <List>
                        {event.participants.map(
                            (p: { id: string; email: string }) => (
                                <ListItem
                                    key={p.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleRemoveParticipant(p.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={p.email} />
                                </ListItem>
                            )
                        )}
                    </List>
                )}
            </Paper>
        </Container>
    );
}