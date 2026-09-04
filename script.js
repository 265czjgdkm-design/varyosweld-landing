// Google's form-response endpoint doesn't send CORS headers, so a `fetch`
// POST gets its result blocked by the browser even when the submission
// itself lands. A classic hidden <form> POST into a hidden iframe sidesteps
// that entirely -- browsers have always allowed cross-origin form posts; we
// just can't read the response, so we treat the iframe's `load` event as
// "submitted".
const FORM_RESPONSE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdxzjxWewO-7ncfq0S2pgwWvnzllVKYEygO2vhjcxqw5acubw/formResponse';
const EMAIL_ENTRY_FIELD = 'entry.708179914';

function submitSignupEmail(email) {
  return new Promise((resolve) => {
    const frameName = `signup_frame_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const iframe = document.createElement('iframe');
    iframe.name = frameName;
    iframe.style.display = 'none';

    function cleanUp() {
      iframe.remove();
    }

    // The iframe must finish its own initial navigation (about:blank) and
    // register `frameName` as a browsing context *before* the form submits
    // targeting it -- otherwise the browser can't resolve that target yet
    // and opens a brand-new tab instead of posting into the hidden iframe.
    let submitted = false;
    let ready = false;
    let readyFallback;

    function onInitialLoad() {
      if (ready) return;
      ready = true;
      clearTimeout(readyFallback);
      iframe.removeEventListener('load', onInitialLoad);
      submitForm();
    }
    iframe.addEventListener('load', onInitialLoad);
    document.body.appendChild(iframe);

    readyFallback = setTimeout(onInitialLoad, 3000);

    function submitForm() {
      clearTimeout(readyFallback);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = FORM_RESPONSE_URL;
      form.target = frameName;
      form.style.display = 'none';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = EMAIL_ENTRY_FIELD;
      input.value = email;
      form.appendChild(input);

      const timer = setTimeout(() => {
        if (!submitted) {
          submitted = true;
          resolve(false);
        }
        cleanUp();
        form.remove();
      }, 8000);

      iframe.addEventListener('load', () => {
        clearTimeout(timer);
        if (!submitted) {
          submitted = true;
          resolve(true);
        }
        cleanUp();
        form.remove();
      });

      document.body.appendChild(form);
      form.submit();
    }
  });
}

function wireSignupForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form || !success) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const emailInput = form.querySelector('input[name="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) return;

    const button = form.querySelector('.signup-button');
    if (button) button.disabled = true;

    const ok = await submitSignupEmail(email);

    if (ok) {
      form.hidden = true;
      success.hidden = false;
    } else if (button) {
      button.disabled = false;
    }
  });
}

wireSignupForm('hero-form', 'hero-success');
wireSignupForm('footer-form', 'footer-success');
