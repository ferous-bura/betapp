// script.js

var selectedNumbers = [];
var selectedBetValue = null;

function selectNumber(element) {
    var number = element.dataset.number;

    // Select number without hiding the value card
    if (!selectedNumbers.includes(number)) {
        selectedNumbers.push(number);

        // Show the value card on the first selection
        if (selectedNumbers.length === 1) {
            document.getElementById('value-card').style.display = 'flex';
        }

        // Show the selected numbers card
        document.getElementById('selected-numbers-card').style.display = 'flex';

        // Toggle the 'selected' class for styling
        element.classList.toggle('selected');

        // Update the selected numbers display
        updateSelectedNumbers();

        // Apply step animation to the selected numbers card
        document.getElementById('selected-numbers-card').classList.add('step-animation');

        // Log selected numbers to the console (you can replace this with your AJAX call)
        console.log('Selected Numbers:', selectedNumbers);
    }
}

// Example AJAX call (replace with your actual endpoint and data)
function sendSelections() {
    alert('Selected Numbers: ' + selectedNumbers.join(', '));
    /*            // Replace 'your_server_endpoint' with your actual server endpoint
    */            var endpoint = '/your_server_endpoint';

    // Perform AJAX request
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selections: selectedNumbers }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function clearSelections() {
    // Clear selected numbers and remove 'selected' class from buttons
    selectedNumbers = [];
    var buttons = document.querySelectorAll('.number-button');
    buttons.forEach(function (button) {
        button.classList.remove('selected');
    });

    // Hide the value card and selected numbers card
    document.getElementById('value-card').style.display = 'none';
    document.getElementById('selected-numbers-card').style.display = 'none';

    // Remove step animation class
    document.getElementById('selected-numbers-card').classList.remove('step-animation');
}

function setBetValue(value) {
    // Set the selected bet value and hide the value card
    selectedBetValue = value;
    document.getElementById('value-card').style.display = 'none';

    // Log the selected bet value to the console (you can replace this with your desired logic)
    console.log('Selected Bet Value:', selectedBetValue);
}

function updateSelectedNumbers() {
    // Update the selected numbers display in the card
    document.getElementById('selected-numbers').textContent = 'Selected Numbers: ' + selectedNumbers.join(', ');
}
