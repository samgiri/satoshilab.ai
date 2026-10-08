document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.rel = 'noopener noreferrer';
});

document.querySelectorAll('a[title]').forEach((link) => {
  if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', link.title);
});

/* Enquiry forms: submit in place and confirm on the page instead of leaving for Formspree's generic page. */
document.querySelectorAll('form.enquiry-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const label = button ? button.textContent : '';
    if (button) { button.disabled = true; button.textContent = 'Sending…'; }
    const note = document.createElement('p');
    note.setAttribute('role', 'status');
    note.style.cssText = 'margin-top:1rem;font-weight:600;';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Request failed');
      note.textContent = 'Thank you. We have received your enquiry and will reply within 24 hours.';
      form.reset();
      form.querySelectorAll('input, select, textarea, button').forEach((el) => { el.disabled = true; });
      if (button) button.textContent = 'Sent';
    } catch (error) {
      note.textContent = 'Sorry, we could not send that. Please email info@satoshilab.ai or message us on WhatsApp (+971 58 587 4793).';
      if (button) { button.disabled = false; button.textContent = label; }
    }
    form.querySelectorAll('[role="status"]').forEach((el) => el.remove());
    form.appendChild(note);
  });
});
