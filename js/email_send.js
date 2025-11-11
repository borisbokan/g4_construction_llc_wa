document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    // URL Vašeg Worker-a
    const workerUrl = "https://form-api.g4-construction.com";

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Sprečavamo standardno slanje forme i redirect

        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');

        submitButton.disabled = true; // Onemogućavamo dugme
        submitButton.textContent = 'Sending...'; // Menjamo tekst dugmeta

      fetch(workerUrl, {
            method: 'POST',
            body: formData // Šaljemo FormData objekat direktno
        })
        .then(response => {
            // Bez obzira na status (200, 500), uvek probaj da pročitaš JSON
            return response.json().then(data => ({
                status: response.status,
                ok: response.ok,
                body: data
            }));
        })
        .then(({ ok, body }) => {
            if (ok && body.success) {
                // USPEH - Prikazujemo poruku o uspehu
                alert(body.message); // Koristite lepši pop-up (modal) umesto alert()
                form.reset(); // Resetujemo formu nakon uspeha
            } else {
                // GREŠKA - Prikazujemo poruku o grešci
                alert('Error: ' + body.message);
            }
        })
        .catch(error => {
            // Greška u mreži ili Worker-u
            console.error('Fetch error:', error);
            alert('A network error occurred. Please check your connection.');
        })
        .finally(() => {
            // Vraćamo dugme u prvobitno stanje
            submitButton.disabled = false;
            submitButton.textContent = 'Send Request';
        });
    });
});