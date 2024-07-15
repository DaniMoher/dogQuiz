// List of questions and answers
const questionnaire = [
    {
        question: "How long does the average dog live?",
        correct: "10 - 13 years",
        incorrect: ["12 - 13 years", "8 - 9 years", "13 - 15 years", "15+ years"]
    },
    {
        question: "In 2024, which dog breed was most popular in the US?",
        correct: "French Bulldog",
        incorrect: ["Labrador", "Golden Retriever", "German Shepherd", "Poodle"]
    },
    {
        question: "Which dog breed is considered to be 'barkless'?",
        correct: "Basenji",
        incorrect: ["Mastiff", "English Bulldog", "Irish Setter", "Beagle"]
    },
    {
        question: "Which breed does NOT naturally come in merle?",
        correct: "Poodle",
        incorrect: ["Australian Shepherd", "Mudi", "Cardigan Welsh Corgi", "Dachshund"]
    },
    {
        question: "How many breeds does the AKC recognize?",
        correct: "200",
        incorrect: ["180", "120", "364", "245"]
    }
];
// Element references
const answerWrapper = document.querySelector(".answerWrapper");
const question = document.querySelector(".question");
const barItem = document.querySelector(".barItem");
const barContainer = document.querySelector(".quizProgressBar");
const progressBar = document.querySelector(".barItemProgress");
const next = document.querySelector(".nextQuestion");
const begin = document.querySelector(".beginQuiz");
// Arrays and variables to manage status throughout quiz
const questions = [];
const user = { score: 0, answers: [] };
let current = 0;
const holder = [];
// Load questions immediately on launch
(() => {
    loadQuestions();
})();
// Fill 'questions' array with properly formatted data
function loadQuestions() {
    questionnaire.forEach((q) => {
        let temp = [];
        q.incorrect.forEach((ans) => {
            let obj = {
                response: ans,
                correct: false
            };
            temp.push(obj);
        });
        let obj = {
            response: q.correct,
            correct: true
        };
        temp.push(obj);
        let mainTemp = {
            question: q.question,
            options: temp,
            correct: q.correct
        };
        questions.push(mainTemp);
    });
}
// Display next question when 'next' button is clicked
function newQuestion() {
    if (current >= questions.length) {
        next.innerHTML = "View Score";
        score();
    } else {
        next.innerHTML = "Next Question";
    }
    answerWrapper.innerHTML = "";
    const element = questions[current];
    progess();
    console.log(element);
    element.options.sort(() => {
        return 0.5 - Math.random();
    });
    // Capitalize the first letter of each question
    const capQuestion = element.question.charAt(0).toUpperCase() + element.question.slice(1);
    question.textContent = `${capQuestion}`;
    answerWrapper.innerHTML = "";
    // Create and arrange answer options for the current question
    element.options.forEach((option) => {
        const options = document.createElement("div");
        holder.push(options);
        options.correctAnswer = element.correct;
        options.que = capQuestion;
        options.isCorrect = option.correct;
        options.classList.add("answerItem");
        options.textContent = option.response;
        answerWrapper.append(options);

        options.addEventListener("click", answerSelect);
    });
}
// Handle user selection of an answer
function answerSelect(answer) {
    endTurn();
    if (answer.target.isCorrect) {
        user.score++;
        let obj = {
            que: answer.target.que,
            res: answer.target.textContent,
            correct: true,
            qNum: current
        };
        user.answers.unshift(obj);
        answer.target.style.color = "#008205";
        answer.target.style.backgroundColor = "#dbfff3";
    } else {
        let obj = {
            que: answer.target.que,
            res: answer.target.textContent,
            correct: false,
            qNum: current
        };
        user.answers.unshift(obj);
        answer.target.style.color = "#e91e63";
        answer.target.style.backgroundColor = "#ffd3e2";
    }
    answer.target.style.cursor = "pointer";
}
// End the current question's display and swap to new question
function endTurn() {
    holder.forEach((element) => {
        element.removeEventListener("click", answerSelect);
        element.style.backgroundColor = "#ffffff05";
        element.style.color = "#565656";
        element.style.cursor = "default";
    });
    current++;
    if (current >= questions.length) {
        next.innerHTML = "View Score";
    } else {
        next.innerHTML = "Next Question";
    }
}
// Update progress bar to display progress
function progess() {
    barItem.style.width = "60%";
    next.classList.add("progressActive");
    question.style.display = "block";

    const currentQ = current + 1;
    const progressIs = (currentQ / questions.length) * 100;

    if (progressIs === 100) {
        next.innerHTML = "View Score";
        progressBar.style.maxWidth = "100%";
    }
    progressBar.style.width = `${progressIs}%`;
}
// Event listeners to begin the quiz and navigate to future questions
begin.addEventListener("click", newQuestion);
next.addEventListener("click", () => {
    if (current >= questions.length) {
        score();
    } else {
        newQuestion();
    }
});
// Display final score and summary of answers
function score() {
    console.log(user.score);
    question.style.display = "block";
    answerWrapper.innerHTML = "";
    question.textContent = `Quiz Summary`;
    // Display each answer's details in the summary
    user.answers.forEach((ans, i) => {
        const scoreMockup = `
		<div class="score">
		<div class="scoreQuestion"><span>${ans.qNum}</span> ${ans.que}</div>
		<div>${ans.res}</div>
		<div>${ans.correct}</div>
		</div>`;
        answerWrapper.insertAdjacentHTML("afterbegin", scoreMockup);
    });
    // Calculate score percentage and adjust progress bar color based on score
    const progressIs = (user.score / questions.length) * 100;
    next.innerHTML = `${user.score} / ${questions.length} points`;

    if (progressIs <= 50) {
        barItem.style.backgroundColor = `#ff8585`;
        progressBar.style.backgroundColor = `red`;
    } else if (progressIs <= 75) {
        barItem.style.backgroundColor = `#ffc582`;
        progressBar.style.backgroundColor = `#ff8900`;
    } else {
        barItem.style.backgroundColor = `#bcffda`;
        progressBar.style.backgroundColor = `#00d15e`;
    }

    progressBar.style.width = `${progressIs}%`;
}