// Postavke za SendGrid (zameni ovim podacima!)
const SENDGRID_API_KEY = "VAŠ_SENDGRID_API_KEY_OVDE"; // SendGrid ključ
const G4_RECEIVING_EMAIL = "info@g4-construction.com"; // Email primaoca

// Glavna funkcija (handler) koja presreće HTTP zahtev
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 1. Provera metode
  if (request.method !== 'POST') {
    return Response.redirect(new URL('/contact.html', request.url), 303);
  }
  
  // URL za preusmeravanje nakon obrade (podesi svoju kontakt stranicu)
  const CONTACT_PAGE_URL = new URL('/contact.html', request.url).origin + '/contact.html';

  try {
    // 2. Parsiranje podataka iz forme (FormData)
    const formData = await request.formData();
    
    // Dohvatanje polja (koristimo engleske nazive!)
    const name = formData.get('name') ? formData.get('name').trim() : '';
    const email = formData.get('email') ? formData.get('email').trim() : '';
    const message = formData.get('message') ? formData.get('message').trim() : '';
    const service = formData.get('service') ? formData.get('service').trim() : '';

    // 3. Validacija (Provera praznih polja i email formata)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message || !service || !emailRegex.test(email)) {
      // Ako validacija ne uspe, preusmeri na stranicu sa statusom greške
      return Response.redirect(`${CONTACT_PAGE_URL}?status=error_validation`, 303);
    }
    
    // 4. Priprema sadržaja emaila
    const emailSubject = `NEW INQUIRY (${service}) | From: ${name}`;
    const emailBody = `A new message has been received from the G4 Construction website contact form. \n\n` + 
                      `--- Inquiry Details ---\n` +
                      `Name: ${name}\n` + 
                      `Email: ${email}\n` +
                      `Service Requested: ${service}\n` +
                      `-------------------------\n\n` +
                      `Message:\n${message}`;

    // 5. Slanje emaila putem SendGrid API-ja
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: G4_RECEIVING_EMAIL }],
            subject: emailSubject,
          },
        ],
        from: { email: G4_RECEIVING_EMAIL, name: "G4 Website Form" }, // Posiljalac
        reply_to: { email: email, name: name }, // Odgovor se salje nazad klijentu
        content: [
          {
            type: 'text/plain',
            value: emailBody,
          },
        ],
      }),
    });

    // 6. Provera statusa slanja i preusmeravanje
    if (sendGridResponse.ok) {
      // USPEH: Preusmeri na stranicu sa statusom uspeha
      return Response.redirect(`${CONTACT_PAGE_URL}?status=success`, 303);
    } else {
      // GREŠKA: SendGrid je vratio grešku (npr. pogrešan API ključ)
      // console.error(`SendGrid Error: ${await sendGridResponse.text()}`); // Logovanje za debag
      return Response.redirect(`${CONTACT_PAGE_URL}?status=error_sendgrid`, 303);
    }

  } catch (error) {
    // FATALNA GREŠKA (npr. greška pri parsiranju forme)
    // console.error(`Fatal Error: ${error.message}`); // Logovanje za debag
    return Response.redirect(`${CONTACT_PAGE_URL}?status=error_fatal`, 303);
  }
}