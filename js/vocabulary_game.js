document.addEventListener('DOMContentLoaded', () => {
    const wordListElement = document.getElementById('word-list');
    const definitionListElement = document.getElementById('definition-list');
    const scoreElement = document.getElementById('score');
    const feedbackElement = document.getElementById('feedback-message');
    const resetButton = document.getElementById('reset-game-btn');

    let score = 0;
    let wordsData = [
        { id: 'word1', term: 'Serendipity', definition: 'Finding something good without looking for it.' },
        { id: 'word2', term: 'Ephemeral', definition: 'Lasting for a very short time.' },
        { id: 'word3', term: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.' },
        { id: 'word4', term: 'Mellifluous', definition: 'A sound that is sweet and smooth, pleasing to hear.' },
        { id: 'word5', term: 'Idyllic', definition: 'Extremely happy, peaceful, or picturesque.' }
    ];

    let draggedItem = null; // To store the element being dragged

    // Function to shuffle an array (Fisher-Yates shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to initialize or reset the game
    function initGame() {
        score = 0; // Reset score for a new game
        updateScore();
        feedbackElement.textContent = '';
        feedbackElement.className = '';
        wordListElement.innerHTML = '';
        definitionListElement.innerHTML = '';

        // Shuffle words and definitions independently to make it a game
        let terms = wordsData.map(item => ({ id: item.id, text: item.term, type: 'term' }));
        let definitions = wordsData.map(item => ({ id: item.id, text: item.definition, type: 'definition' }));
        
        shuffleArray(terms);
        shuffleArray(definitions);

        terms.forEach(term => {
            const li = document.createElement('li');
            li.textContent = term.text;
            li.draggable = true;
            li.dataset.id = term.id; // Store the original ID for matching
            li.classList.add('draggable-item'); // Keep this if you have specific styles for draggable-item
            wordListElement.appendChild(li);
        });

        definitions.forEach(def => {
            const li = document.createElement('li');
            li.textContent = def.text;
            li.dataset.id = def.id; // Store the original ID for matching
            // li.classList.add('droppable-target'); // Keep this if you have specific styles for droppable-target
            definitionListElement.appendChild(li);
        });

        addDragDropListeners();
    }

    // Add drag and drop event listeners
    function addDragDropListeners() {
        const draggables = document.querySelectorAll('#word-list li');
        const droppables = document.querySelectorAll('#definition-list li');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', (e) => {
                draggedItem = draggable;
                e.dataTransfer.setData('text/plain', draggable.dataset.id); // Use text/plain for better compatibility
                setTimeout(() => draggable.classList.add('dragging'), 0); // Visual feedback
            });

            draggable.addEventListener('dragend', () => {
                if (draggedItem) { // Check if draggedItem still exists
                    draggedItem.classList.remove('dragging');
                }
                // No need to set draggedItem to null here if it's already removed on successful drop
            });
        });

        droppables.forEach(droppable => {
            droppable.addEventListener('dragover', (e) => {
                e.preventDefault(); // Necessary to allow dropping
                droppable.classList.add('drag-over');
            });

            droppable.addEventListener('dragleave', () => {
                droppable.classList.remove('drag-over');
            });

            droppable.addEventListener('drop', (e) => {
                e.preventDefault();
                droppable.classList.remove('drag-over');
                const wordId = e.dataTransfer.getData('text/plain');
                const definitionId = droppable.dataset.id;

                if (draggedItem && draggedItem.dataset.id === wordId) { // Ensure draggedItem is the one we're dropping
                    if (wordId === definitionId) { // Correct match
                        score += 10;
                        feedbackElement.textContent = 'Correct!';
                        feedbackElement.className = 'correct';
                        
                        // Make the dropped definition item visually distinct and non-interactive for future drops
                        droppable.style.backgroundColor = '#a3d9a5'; // Greenish for correct
                        droppable.innerHTML = draggedItem.textContent + ' - ' + droppable.textContent; // Combine text
                        droppable.dataset.matched = "true"; // Mark as matched

                        // Remove further drag/drop listeners from the matched definition
                        droppable.removeEventListener('dragover', arguments.callee);
                        droppable.removeEventListener('dragleave', arguments.callee);
                        droppable.removeEventListener('drop', arguments.callee);


                        draggedItem.remove(); // Remove the original word item
                        draggedItem = null; // Clear draggedItem as it's been handled

                        // Check if all items are matched
                        if (wordListElement.children.length === 0) {
                            feedbackElement.textContent = 'Congratulations! You matched all words!';
                            feedbackElement.className = 'correct';
                            // Optionally, disable further interactions or show a game over message
                        }

                    } else { // Incorrect match
                        score -= 5; // Penalty for incorrect match
                        feedbackElement.textContent = 'Incorrect. Try again!';
                        feedbackElement.className = 'incorrect';
                        // draggedItem remains draggable for another attempt
                        if (draggedItem) {
                           draggedItem.classList.remove('dragging'); // Reset dragging class if match is wrong
                        }
                    }
                    updateScore();
                }
                 // Reset draggedItem if it wasn't handled by a correct match (e.g. dropped on wrong target)
                if (draggedItem && !draggedItem.parentNode) { // if it was removed
                     draggedItem = null;
                } else if (draggedItem) { // if it's still in the list (incorrect match)
                    draggedItem.classList.remove('dragging');
                    // draggedItem = null; // Do not nullify here, allow re-dragging
                }
            });
        });
    }

    function updateScore() {
        scoreElement.textContent = score;
        // Optionally save score to localStorage
        localStorage.setItem('vocabularyGameScore', score);
    }
    
    // Load score from localStorage if available
    function loadScore() {
        const savedScore = localStorage.getItem('vocabularyGameScore');
        if (savedScore !== null) { // Check for null explicitly
            score = parseInt(savedScore, 10);
        } else {
            score = 0; // Default to 0 if nothing is saved
        }
    }

    resetButton.addEventListener('click', () => {
        localStorage.removeItem('vocabularyGameScore'); // Clear score on reset
        initGame();
    });

    // Initialize the game when the page loads
    loadScore(); // Load score before initGame
    initGame(); 
});
