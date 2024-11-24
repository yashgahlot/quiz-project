const app = document.getElementById('app');
const pages = document.querySelectorAll('.page');
const quizTitle = document.getElementById('quiz-title');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const timerDisplay = document.getElementById('time-left');
const resultsDisplay = document.getElementById('results');
const welcomeHeading = document.getElementById('welcome-heading');
const nameInput = document.getElementById('name-input');
const progressTracker = document.getElementById('progress-tracker');
const progressBar = document.getElementById('progress-bar');

let currentQuiz = null;
let currentQuestionIndex = 0;
let timerInterval = null;
let timeLeft = 20;
let score = 0;

// Quizzes with 4 questions each
const quizzes = {
    math: [
        { question: '5 + 3 = ?', options: [6, 7, 8, 9], answer: 8 },
        { question: '10 - 6 = ?', options: [5, 4, 3, 2], answer: 4 },
        { question: '7 * 6 = ?', options: [42, 46, 48, 36], answer: 42 },
        { question: '9 / 3 = ?', options: [3, 6, 4, 2], answer: 3 }
    ],
    science: [
        { question: 'What is the chemical symbol for water?', options: ['H2O', 'O2', 'NaCl', 'CO2'], answer: 'H2O' },
        { question: 'What planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Mars' },
        { question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 'Carbon Dioxide' },
        { question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], answer: 'Diamond' }
    ],
    general: [
        { question: 'Who wrote "Hamlet"?', options: ['Shakespeare', 'Dickens', 'Austen', 'Hemingway'], answer: 'Shakespeare' },
        { question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], answer: 'Paris' },
        { question: 'What is the largest mammal?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Rhino'], answer: 'Blue Whale' },
        { question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific' }
    ],
    history: [
        { question: 'Who was the first President of the United States?', options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], answer: 'George Washington' },
        { question: 'In what year did World War II end?', options: ['1945', '1940', '1939', '1947'], answer: '1945' },
        { question: 'Who was known as the Iron Lady?', options: ['Queen Elizabeth', 'Margaret Thatcher', 'Angela Merkel', 'Marie Curie'], answer: 'Margaret Thatcher' },
        { question: 'Which empire built the Colosseum?', options: ['Greek', 'Roman', 'Ottoman', 'Persian'], answer: 'Roman' }
    ]
};

// Function to show a specific page
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Reset the welcome page and show it
function showHome() {
    nameInput.style.display = "block";
    nameInput.value = ""; // Clear the input field
    nameInput.nextElementSibling.style.display = "inline-block"; // Show the submit button
    welcomeHeading.textContent = "Welcome to BrainBolt"; // Reset the heading

    showPage('welcome-page');
    resetQuiz();
}

// Show the quiz list page
function showQuizList() {
    showPage('quiz-list-page');
}

// Start a quiz
function startQuiz(quizName) {
    currentQuiz = quizzes[quizName].sort(() => Math.random() - 0.5); // Shuffle questions
    currentQuestionIndex = 0;
    score = 0;

    // Adjust timer based on quiz type
    timeLeft = quizName === 'math' ? 20 : 15;

    showPage('quiz-page');
    quizTitle.textContent = `${quizName.charAt(0).toUpperCase() + quizName.slice(1)} Quiz`;

    // Countdown before starting
    let countdown = 3;
    questionText.textContent = `Starting in ${countdown}...`;
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            loadQuestion();
        } else {
            questionText.textContent = `Starting in ${countdown}...`;
        }
    }, 1000);
}

// Load the current question
function loadQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
        showResults();
        return;
    }

    const question = currentQuiz[currentQuestionIndex];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => handleAnswer(option);
        optionsContainer.appendChild(button);
    });

    // Update progress tracker
    progressTracker.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.length}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;

    // Reset and start the timer
    timeLeft = timeLeft || 20; // Default to 20 if not set
    timerDisplay.textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// Update the timer
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleAnswer(null); // If time runs out
    }
}

// Handle the user's answer
function handleAnswer(selectedOption) {
    clearInterval(timerInterval);
    const question = currentQuiz[currentQuestionIndex];
    if (selectedOption === question.answer) {
        score++;
    }
    currentQuestionIndex++;
    loadQuestion();
}

// Show the results page
function showResults() {
    showPage('results-page');

    // Provide feedback based on score
    let feedback = '';
    const percentage = (score / currentQuiz.length) * 100;

    if (percentage === 100) {
        feedback = 'Outstanding! You got a perfect score!';
    } else if (percentage >= 75) {
        feedback = 'Great job! You scored really well.';
    } else if (percentage >= 50) {
        feedback = 'Not bad! Keep practicing and you’ll do even better!';
    } else {
        feedback = 'Better luck next time! Don’t give up!';
    }

    const userName = nameInput.value.trim() || 'Anonymous';

    // Save to leaderboard
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: userName, score: percentage.toFixed(2) });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    resultsDisplay.innerHTML = `
        You scored ${score} out of ${currentQuiz.length}.<br><br>${feedback}
    `;
}

// Restart the current quiz
function restartQuiz() {
    startQuiz(currentQuiz);
}

// Reset the quiz data
function resetQuiz() {
    currentQuiz = null;
    currentQuestionIndex = 0;
    clearInterval(timerInterval);
    timerDisplay.textContent = '';
    resultsDisplay.textContent = '';
}

// Update the welcome message with the user's name
function updateWelcomeMessage() {
    const userName = nameInput.value.trim(); // Get the user's name
    if (userName) {
        welcomeHeading.textContent = `Welcome to BrainBolt, ${userName}!`;
        nameInput.style.display = 'none'; // Hide input field
        nameInput.nextElementSibling.style.display = 'none'; // Hide the submit button
        setTimeout(() => showQuizList(), 1000); // Automatically proceed to the quiz list
    } else {
        alert('Please enter your name to proceed.');
    }
}

// Show the leaderboard
function showLeaderboard() {
    showPage('leaderboard-page');

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = leaderboard
        .sort((a, b) => b.score - a.score) // Sort by score (highest first)
        .map(entry => `<li>${entry.name}: ${entry.score}%</li>`)
        .join('');
}

// Create the Theme Toggle Button
const themeToggle = document.createElement('button');
themeToggle.textContent = "Dark Mode";
themeToggle.classList.add('theme-toggle');
themeToggle.addEventListener('click', () => {
    // Toggle Dark Mode on the body
    document.body.classList.toggle('dark-mode');
    // Update button text based on the mode
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? "Light Mode" : "Dark Mode";
});
// Add the Theme Toggle Button to the App
app.prepend(themeToggle);
