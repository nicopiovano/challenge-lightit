import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import type { Patient } from "../types/patient";

type Props = {
  patient: Patient;
  photoUrl: string;
};

export default function PatientCard({ patient, photoUrl }: Props) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Avatar
          src={photoUrl}
          alt={`${patient.name} ${patient.last_name}`}
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <Box>
          <Typography fontWeight={600}>
            {patient.name} {patient.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {patient.email}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <Box
            component="img"
            src={photoUrl}
            alt={`${patient.name} ${patient.last_name}`}
            sx={{
              width: 140,
              height: 140,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />

          <Box sx={{ minWidth: 240 }}>
            <Typography>
              <strong>Teléfono:</strong> {patient.phone}
            </Typography>
            <Typography>
              <strong>Email:</strong> {patient.email}
            </Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
