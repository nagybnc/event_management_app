import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Button,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
    event: {
        id: string;
        title: string;
        status: string;
        location: string;
        startDate: string;
        endDate: string;
        participants: { id: string }[];
    };
    locationLabels: Record<string, string>;
    onDelete: (id: string) => void;
}

export default function EventCard({ event, locationLabels, onDelete }: EventCardProps) {
    const navigate = useNavigate();

    return (
        <Card>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">{event.title}</Typography>
                    <Chip
                        label={event.status}
                        color={event.status === "PUBLISHED" ? "success" : "default"}
                        size="small"
                    />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    {locationLabels[event.location] ?? event.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {new Date(event.startDate).toLocaleString()} —{" "}
                    {new Date(event.endDate).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    {event.participants.length} participant(s)
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => navigate(`/events/${event.id}`)}>
                    Details
                </Button>
                <Button size="small" color="error" onClick={() => onDelete(event.id)}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}