const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultDiv = document.getElementById("result");
const welcomeContainer = document.getElementById("welcome-container");
const quizContainer = document.getElementById("quiz-container");
const startQuizButton = document.getElementById("start-quiz-btn");

let shuffledQuestions, currentQuestionIndex, score;

const questions = [
   {
       question: "What is 2 + 2?",
       answers: [
           { text: "4", correct: true },
           { text: "22", correct: false },
           { text: "222", correct: false },
           { text: "2222", correct: false },
       ],
   },
   {
       question: "What does HTML stand for?",
       answers: [
           { text: "HyperText Markup Language", correct: true },
           { text: "HighText Machine Language", correct: false },
           { text: "HyperText Machine Language", correct: false },
           { text: "HighText Markup Language", correct: false },
       ],
   },
   {
       question: "Which property is used to change the background color?",
       answers: [
           { text: "color", correct: false },
           { text: "bgColor", correct: false },
           { text: "background-color", correct: true },
           { text: "background", correct: false },
       ],
   },
   {
       question: "Inside which HTML element do we put the JavaScript?",
       answers: [
           { text: "<js>", correct: false },
           { text: "<javascript>", correct: false },
           { text: "<script>", correct: true },
           { text: "<scripting>", correct: false },
       ],
   },
];

function startQuiz() {
   score = 0;
   shuffledQuestions = questions.sort(() => Math.random() - 0.5);
   currentQuestionIndex = 0;
   nextButton.classList.remove("hide");
   restartButton.classList.add("hide");
   resultDiv.classList.add("hide");
   questionContainer.classList.remove("hide");
   setNextQuestion();
}

startQuizButton.addEventListener("click", () => {
   welcomeContainer.classList.add("hide");
   quizContainer.classList.remove("hide");
   startQuiz();
});

function setNextQuestion() {
   resetState();
   showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
   questionElement.innerText = question.question; // Display the question text
   question.answers.forEach((answer, index) => {
       const inputGroup = document.createElement("div");
       inputGroup.classList.add("input-group");
       const radio = document.createElement("input");
       radio.type = "radio";
       radio.id = "answer" + index;
       radio.name = "answer";
       radio.value = index;

       const label = document.createElement("label");
       label.htmlFor = "answer" + index;
       label.innerText = answer.text;

       inputGroup.appendChild(radio);
       inputGroup.appendChild(label);
       answerButtons.appendChild(inputGroup);
   });
}

function resetState() {
   while (answerButtons.firstChild) {
       answerButtons.removeChild(answerButtons.firstChild);
   }
}

nextButton.addEventListener("click", () => {
   const answerIndex = Array.from(answerButtons.querySelectorAll("input")).findIndex((radio) => radio.checked);
   if (answerIndex !== -1) {
       if (shuffledQuestions[currentQuestionIndex].answers[answerIndex].correct) {
           score++;
       }
       currentQuestionIndex++;
       if (shuffledQuestions.length > currentQuestionIndex) {
           setNextQuestion();
       } else {
           endQuiz();
       }
   } else {
       alert("Please select an answer.");
   }
});

restartButton.addEventListener("click", startQuiz);

function endQuiz() {
   questionContainer.classList.add("hide");
   nextButton.classList.add("hide");
   resultDiv.classList.remove("hide");
   resultDiv.innerText = `You scored ${score} out of ${shuffledQuestions.length}`;
   restartButton.classList.remove("hide");
}

function updateProgressBar() {
   const progressBar = document.getElementById("progress-bar");
   const progressPercentage = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
   progressBar.style.width = `${progressPercentage}%`;
}

function setNextQuestion() {
   resetState();
   showQuestion(shuffledQuestions[currentQuestionIndex]);
   updateProgressBar(); // Update the progress bar on each question
}
