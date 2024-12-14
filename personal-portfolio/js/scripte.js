// Script to handle form submission
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Thank you for reaching out! I will get back to you soon.');
    document.getElementById('contact-form').reset(); // Clear the form fields
});
