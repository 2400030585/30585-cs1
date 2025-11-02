import React, { useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  FormHelperText,
  Stack
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'

const DOCTORS = [
  { label: 'Dr. Rao – Cardiology', dept: 'Cardiology' },
  { label: 'Dr. Meera – Dermatology', dept: 'Dermatology' },
  { label: 'Dr. Arjun – Pediatrics', dept: 'Pediatrics' }
]

const DEPARTMENTS = ['Cardiology', 'Dermatology', 'Pediatrics', 'General Medicine']

const defaultValues = {
  patientName: '',
  phone: '',
  email: '',
  doctor: '',
  department: '',
  date: null,
  time: null,
  visitType: 'New',
  notes: '',
  consent: false
}

export default function AppointmentForm({ onSubmit, editing, onUpdate, onCancelEdit }) {
  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editing) {
      // editing.date and time were stored as ISO strings; convert to dayjs
      setValues({
        patientName: editing.patientName || '',
        phone: editing.phone || '',
        email: editing.email || '',
        doctor: editing.doctor || '',
        department: editing.department || '',
        date: editing.date ? dayjs(editing.date) : null,
        time: editing.time ? dayjs(editing.time) : null,
        visitType: editing.visitType || 'New',
        notes: editing.notes || '',
        consent: editing.consent || false,
        id: editing.id
      })
      setErrors({})
    }
  }, [editing])

  const validate = (fieldVals = values) => {
    const temp = { ...errors }

    if ('patientName' in fieldVals)
      temp.patientName = fieldVals.patientName ? '' : 'Patient name is required.'

    if ('phone' in fieldVals) {
      const clean = (fieldVals.phone || '').replace(/\D/g, '')
      temp.phone = clean.length === 10 ? '' : 'Enter a valid 10-digit phone number.'
    }

    if ('email' in fieldVals) {
      if (!fieldVals.email) temp.email = ''
      else {
        temp.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldVals.email)
          ? ''
          : 'Enter a valid email.'
      }
    }

    if ('doctor' in fieldVals) temp.doctor = fieldVals.doctor ? '' : 'Select a doctor.'

    if ('department' in fieldVals)
      temp.department = fieldVals.department ? '' : 'Select a department.'

    if ('date' in fieldVals) {
      if (!fieldVals.date) temp.date = 'Pick a date.'
      else temp.date = dayjs(fieldVals.date).isAfter(dayjs().subtract(1, 'day')) ? '' : 'Date must be in the future.'
    }

    if ('time' in fieldVals) {
      if (!fieldVals.time) temp.time = 'Pick a time.'
      else {
        const hour = dayjs(fieldVals.time).hour()
        temp.time = hour >= 9 && hour < 17 ? '' : 'Time must be within 09:00–17:00.'
      }
    }

    if ('consent' in fieldVals) temp.consent = fieldVals.consent ? '' : 'Consent is required.'

    setErrors({ ...temp })

    return Object.values(temp).every((x) => x === '')
  }

  useEffect(() => {
    validate(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const handleChange = (field) => (e) => {
    const value = e && e.target ? e.target.value : e
    setValues((v) => ({ ...v, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      patientName: values.patientName,
      phone: values.phone,
      email: values.email,
      doctor: values.doctor,
      department: values.department,
      date: values.date ? dayjs(values.date).toISOString() : null,
      time: values.time ? dayjs(values.time).toISOString() : null,
      visitType: values.visitType,
      notes: values.notes,
      consent: values.consent
    }

    if (editing && values.id) {
      onUpdate({ ...payload, id: values.id, status: editing.status })
    } else {
      onSubmit(payload)
    }

    setValues(defaultValues)
    setErrors({})
  }

  const handleReset = () => {
    setValues(defaultValues)
    setErrors({})
    if (onCancelEdit) onCancelEdit()
  }

  const canSubmit = () => {
    return (
      values.patientName &&
      values.phone &&
      values.doctor &&
      values.department &&
      values.date &&
      values.time &&
      values.consent &&
      Object.values(errors).every((x) => x === '')
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Patient Name"
            fullWidth
            required
            value={values.patientName}
            onChange={(e) => setValues((v) => ({ ...v, patientName: e.target.value }))}
            error={!!errors.patientName}
            helperText={errors.patientName}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone Number"
            fullWidth
            required
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            fullWidth
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.doctor}>
            <InputLabel>Doctor</InputLabel>
            <Select
              value={values.doctor}
              label="Doctor"
              onChange={(e) => {
                const selected = DOCTORS.find((d) => d.label === e.target.value)
                setValues((v) => ({ ...v, doctor: e.target.value, department: selected?.dept || v.department }))
              }}
            >
              {DOCTORS.map((d) => (
                <MenuItem key={d.label} value={d.label}>
                  {d.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.doctor}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={DEPARTMENTS}
            value={values.department}
            onChange={(e, newVal) => setValues((v) => ({ ...v, department: newVal }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Department"
                error={!!errors.department}
                helperText={errors.department}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <DatePicker
            label="Appointment Date"
            value={values.date}
            onChange={(newVal) => setValues((v) => ({ ...v, date: newVal }))}
            renderInput={(params) => (
              <TextField {...params} fullWidth error={!!errors.date} helperText={errors.date} />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TimePicker
            label="Appointment Time"
            value={values.time}
            onChange={(newVal) => setValues((v) => ({ ...v, time: newVal }))}
            renderInput={(params) => (
              <TextField {...params} fullWidth error={!!errors.time} helperText={errors.time} />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={values.visitType}
              onChange={(e) => setValues((v) => ({ ...v, visitType: e.target.value }))}
            >
              <FormControlLabel value="New" control={<Radio />} label="New" />
              <FormControlLabel value="Follow-up" control={<Radio />} label="Follow-up" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Symptoms / Notes"
            fullWidth
            multiline
            minRows={3}
            value={values.notes}
            onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value.slice(0, 200) }))}
            helperText={`${values.notes.length}/200`}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl error={!!errors.consent} component="fieldset">
            <FormControlLabel
              control={<Checkbox checked={values.consent} onChange={(e) => setValues((v) => ({ ...v, consent: e.target.checked }))} />}
              label="I agree to clinic policies"
            />
            <FormHelperText>{errors.consent}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={!canSubmit()}>
              {editing ? 'Save Changes' : 'Submit'}
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
            {editing && (
              <Button color="inherit" onClick={onCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </form>
  )
}
