document.addEventListener('DOMContentLoaded', (event) => {
    const ballsGridElement = document.getElementById('balls-grid');

    // Generate and populate the balls grid
    for (let i = 1; i <= 80; i++) {
        const ballElement = document.createElement('div');
        ballElement.className = 'ball'; // Add the "ball" class
        ballElement.textContent = i;
        ballsGridElement.appendChild(ballElement);

        // Add a line break after every 10 balls for a 10-column layout
        if (i % 10 === 0) {
            ballsGridElement.appendChild(document.createElement('br'));
        }
    }
});
