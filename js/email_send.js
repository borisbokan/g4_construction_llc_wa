document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    // KORISTIMO CUSTOM ROUTE:
    const workerUrl = "https://email-handler-g4con.g4build-llc.workers.dev"; 

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');

        submitButton.disabled = true; 
        submitButton.textContent = 'Sending...'; 

      fetch(workerUrl, {
            method: 'POST',
            body: formData 
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
                alert(body.message); 
                form.reset(); 
            } else {
                // Ako Worker vrati grešku (npr. status 500)
                const statusMessage = body.message || 'Unknown Server Error.';
                alert('Error: ' + statusMessage + '\n ');
            }
        })
        .catch(error => {
            // Greška u mreži ili CORS greška
            console.error('Fetch error:', error);
            
            // Provera da li je to CORS ili DNS greška (jer je status 0)
            if (error instanceof TypeError) {
                 alert('Error: Could not connect to the server (DNS/CORS issue). Please contact support. (Code E02)');
            } else {
                 alert('A network error occurred. Please check your connection.');
            }
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Request';
        });
    });
});