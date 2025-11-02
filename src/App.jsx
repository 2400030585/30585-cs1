import React, { useState } from 'react'
import {
  Container,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Snackbar,
  Alert
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AppointmentForm from './components/AppointmentForm'
import AppointmentCard from './components/AppointmentCard'

export default function App() {
  const [appointments, setAppointments] = useState([])
  const [snack, setSnack] = useState({ open: false, message: '' })
  const [editing, setEditing] = useState(null)

  const addAppointment = (appt) => {
    setAppointments((s) => [{ ...appt, id: Date.now(), status: 'Booked' }, ...s])
    setSnack({ open: true, message: 'Appointment booked' })
  }

  const updateAppointment = (updated) => {
    setAppointments((s) => s.map((a) => (a.id === updated.id ? { ...updated } : a)))
    setEditing(null)
    setSnack({ open: true, message: 'Appointment updated' })
  }

  const removeAppointment = (id) => {
    setAppointments((s) => s.filter((a) => a.id !== id))
    setSnack({ open: true, message: 'Appointment cancelled' })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{ py: 4 }} maxWidth="md">
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Book Appointment
            </Typography>
            <AppointmentForm
              onSubmit={addAppointment}
              onUpdate={updateAppointment}
              editing={editing}
              onCancelEdit={() => setEditing(null)}
            />
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={2}>
          {appointments.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No appointments yet.</Typography>
            </Grid>
          ) : (
            appointments.map((appt) => (
              <Grid item xs={12} sm={6} md={4} key={appt.id}>
                <AppointmentCard
                  appointment={appt}
                  onEdit={() => setEditing(appt)}
                  onCancel={() => removeAppointment(appt.id)}
                />
              </Grid>
            ))
          )}
        </Grid>

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ open: false, message: '' })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  )
}
