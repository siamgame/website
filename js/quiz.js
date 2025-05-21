document.addEventListener('DOMContentLoaded', function() {
  const quizData = [
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4"
    },
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: "Pacific"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare"
    }
  ];

  let currentQuestionIndex = 0; // To keep track of the current question
  const submitButton = document.getElementById('submit-quiz');
  const quizResults = document.getElementById('quiz-results');
  const quizContainer = document.getElementById('quiz-container');

  function loadQuestion(index) {
    if (index >= quizData.length) {
      quizContainer.innerHTML = "<p>Quiz finished! Well done!</p>";
      if(submitButton) submitButton.style.display = 'none'; // Hide submit button if quiz is over
      updateProgressDisplay(); // Ensure progress is updated at the end
      return;
    }
    const questionObj = quizData[index];
    quizContainer.innerHTML = `
      <p>${questionObj.question}</p>
      <ul>
        ${questionObj.options.map((opt, i) => `<li><input type="radio" name="q${index}" value="${opt}" id="q${index}a${i}"><label for="q${index}a${i}">${opt}</label></li>`).join('')}
      </ul>
    `;
  }

  function updateProgressDisplay() {
    const pointsDisplay = document.getElementById('points-display');
    const badgesDisplay = document.getElementById('badges-display');
    
    let totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;
    let awardedBadges = JSON.parse(localStorage.getItem('awardedBadges')) || [];

    if (pointsDisplay) pointsDisplay.textContent = totalPoints;
    
    // Badge logic
    if (totalPoints >= 50 && !awardedBadges.includes("Silver Star")) {
      awardedBadges.push("Silver Star");
    }
    if (totalPoints >= 30 && !awardedBadges.includes("Bronze Star")) {
      awardedBadges.push("Bronze Star"); // Add Bronze even if Silver is achieved first in a single go
    }
    
    // Ensure badges are unique and stored
    awardedBadges = [...new Set(awardedBadges)]; // Remove duplicates if any
    localStorage.setItem('awardedBadges', JSON.stringify(awardedBadges));

    if (badgesDisplay) {
      badgesDisplay.textContent = awardedBadges.length > 0 ? awardedBadges.join(', ') : "None";
    }
  }

  if (submitButton) {
    submitButton.addEventListener('click', function() {
      if (currentQuestionIndex >= quizData.length) return; // Quiz already finished

      const selectedAnswerInput = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
      
      if (selectedAnswerInput) {
        const userAnswer = selectedAnswerInput.value;
        const correctAnswer = quizData[currentQuestionIndex].correctAnswer;
        let totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;

        if (userAnswer === correctAnswer) {
          totalPoints += 10;
          localStorage.setItem('totalPoints', totalPoints);
          quizResults.textContent = `Correct! You earned 10 points.`;
        } else {
          quizResults.textContent = `Incorrect. The correct answer was: ${correctAnswer}.`;
        }
        
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex); // Load the next question
        updateProgressDisplay(); // Update points and badges display
        
      } else {
        quizResults.textContent = 'Please select an answer.';
      }
    });
  } else {
    console.error('Submit button not found!');
  }

  // Initial setup
  loadQuestion(currentQuestionIndex); // Load the first question
  updateProgressDisplay(); // Load initial progress
});
