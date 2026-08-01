// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get the button and message elements
    const button = document.getElementById('testBtn');
    const message = document.getElementById('message');
    
    // Add click event to button
    button.addEventListener('click', function() {
        
        // Call the backend api
            fetch('/api/hello')
            .then(response => response.json())  // Convert response to JSON
            .then(data => {
                // Update the page with the response
                message.textContent = 'Backend says: ' + data.message;
            })
            .catch(error => {
                message.textContent = 'Error: Cannot reach backend';
                console.error(error);
            });
    });
});
