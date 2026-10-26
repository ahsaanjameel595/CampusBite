import { useState } from 'react';
import { ArrowRight, Check, Clock3 } from 'lucide-react';
import { Button } from '../common/UI';

const PICKUP_POINTS = ['Main Canteen', 'Library Entrance', 'Student Centre'];

export function CheckoutForm({ onSubmit, submitting = false }) {
  const [values, setValues] = useState({ studentName: '', studentId: '', pickupLocation: '', contactNumber: '' });
  const [errors, setErrors] = useState({});

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (values.studentName.trim().length < 2) nextErrors.studentName = 'Enter your name (at least 2 characters).';
    if (!/^[A-Za-z0-9-]{4,20}$/.test(values.studentId.trim())) nextErrors.studentId = 'Enter a valid student ID (4–20 letters or numbers).';
    if (!values.pickupLocation) nextErrors.pickupLocation = 'Choose a pickup point.';
    if (!/^\+?[0-9\s()-]{7,18}$/.test(values.contactNumber.trim())) nextErrors.contactNumber = 'Enter a valid contact number.';
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSubmit({ ...values, studentName: values.studentName.trim(), studentId: values.studentId.trim(), contactNumber: values.contactNumber.trim() });
  }

  return <form className="checkout-form" onSubmit={submit} noValidate>
    <div className="form-heading"><span className="step-number">01</span><div><h2>Pickup details</h2><p>We’ll have your order ready on campus.</p></div></div>
    <div className="form-grid">
      <label className="form-field form-field--wide">Student name<input name="studentName" autoComplete="name" value={values.studentName} onChange={update} aria-invalid={Boolean(errors.studentName)} aria-describedby={errors.studentName ? 'studentName-error' : undefined} placeholder="Your full name" />{errors.studentName && <small className="field-error" id="studentName-error">{errors.studentName}</small>}</label>
      <label className="form-field">Student ID<input name="studentId" value={values.studentId} onChange={update} aria-invalid={Boolean(errors.studentId)} aria-describedby={errors.studentId ? 'studentId-error' : undefined} placeholder="e.g. 24-CS-104" />{errors.studentId && <small className="field-error" id="studentId-error">{errors.studentId}</small>}</label>
      <label className="form-field">Contact number<input name="contactNumber" type="tel" autoComplete="tel" value={values.contactNumber} onChange={update} aria-invalid={Boolean(errors.contactNumber)} aria-describedby={errors.contactNumber ? 'contactNumber-error' : undefined} placeholder="03XX XXXXXXX" />{errors.contactNumber && <small className="field-error" id="contactNumber-error">{errors.contactNumber}</small>}</label>
      <label className="form-field form-field--wide">Campus pickup point<select name="pickupLocation" value={values.pickupLocation} onChange={update} aria-invalid={Boolean(errors.pickupLocation)} aria-describedby={errors.pickupLocation ? 'pickupLocation-error' : undefined}><option value="">Choose a pickup point</option>{PICKUP_POINTS.map((point) => <option key={point}>{point}</option>)}</select>{errors.pickupLocation && <small className="field-error" id="pickupLocation-error">{errors.pickupLocation}</small>}</label>
    </div>
    <div className="simulation-note"><span><Clock3 size={16} /></span><p><strong>Simulated checkout</strong><br />No payment is collected. You’ll pay when you pick up your order.</p></div>
    <Button type="submit" disabled={submitting} className="checkout-submit">{submitting ? 'Placing order…' : 'Place your order'}{submitting ? <Check size={17} /> : <ArrowRight size={17} />}</Button>
  </form>;
}
