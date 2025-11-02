import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'
import dayjs from 'dayjs'

function initials(text) {
  if (!text) return 'D'
  return text
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
}

export default function AppointmentCard({ appointment, onEdit, onCancel }) {
  const [open, setOpen] = useState(false)

  const handleCancel = () => {
    setOpen(false)
    onCancel()
  }

  return (
    <>
      <Card>
        <CardHeader
          avatar={<Avatar>{initials(appointment.doctor)}</Avatar>}
          title={appointment.doctor}
          subheader={appointment.department}
        />
        <CardContent>
          <Typography variant="h6">
            {appointment.date ? dayjs(appointment.date).format('DD MMM YYYY') : ''} —{' '}
            {appointment.time ? dayjs(appointment.time).format('HH:mm') : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appointment.patientName} • {appointment.phone}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label={appointment.visitType} color="primary" size="small" />
            <Chip label={appointment.status || 'Booked'} color="success" size="small" />
          </Stack>
        </CardContent>
        <CardActions>
          <IconButton size="small" onClick={onEdit} aria-label="edit">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setOpen(true)} aria-label="cancel">
            <CancelIcon fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Cancel appointment?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this appointment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>No</Button>
          <Button color="error" onClick={handleCancel}>
            Yes, cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
