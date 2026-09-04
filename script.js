// Google's form-response endpoint doesn't send CORS headers, so we submit
// with `mode: 'no-cors'` and can't read the response status. The fetch
// promise still rejects on a real network failure, though, which is enough
// to tell "definitely failed" apart from "sent" -- unlike a hidden-iframe
// POST, whose `load` event fires the same way for a 500 as it does for a 200.
const FORM_RESPONSE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdxzjxWewO-7ncfq0S2pgwWvnzllVKYEygO2vhjcxqw5acubw/formResponse';
const EMAIL_ENTRY_FIELD = 'entry.708179914';

let alreadySignedUp = false;

function submitSignupEmail(email) {
  return fetch(FORM_RESPONSE_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams({ [EMAIL_ENTRY_FIELD]: email }),
  });
}

function showSignedUpState() {
  alreadySignedUp = true;
  document.querySelectorAll('[data-role="signup-form"]').forEach((form) => {
    form.hidden = true;
  });
  document.querySelectorAll('.signup-success').forEach((success) => {
    success.hidden = false;
  });
}

function wireSignupForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (alreadySignedUp) return;

    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) return;

    const button = form.querySelector('.signup-button');
    if (button) button.disabled = true;

    try {
      await submitSignupEmail(email);
      showSignedUpState();
    } catch (err) {
      if (button) button.disabled = false;
    }
  });
}

wireSignupForm('hero-form');
wireSignupForm('footer-form');
