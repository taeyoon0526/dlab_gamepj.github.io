const startBtn = document.querySelector(".btn"); // "게임 시작" 버튼
const board = document.querySelector(".game-board");
const timerDisplay = document.querySelector(".timer");
const menuBtn = document.querySelector(".menu_btn"); // "메뉴 화면으로" 버튼

const icons = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🍓"];
let cards = [...icons, ...icons];
let flippedCards = [];
let matchedCards = [];
let startTime = 0;
let timerInterval;
let buttonContainer = null;
let completionMessage = null;

// 시작 버튼 클릭 시 게임 시작
startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    menuBtn.style.display = "none";
    startGame();
});

// 메뉴 버튼 클릭 시 ../index.html로 이동
menuBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
});

// 게임 시작
function startGame() {
    board.innerHTML = "";
    flippedCards = [];
    matchedCards = [];
    clearInterval(timerInterval);
    timerDisplay.textContent = "시간: 0.00초";

    if (completionMessage) {
        completionMessage.remove();
        completionMessage = null;
    }

    if (buttonContainer) {
        buttonContainer.remove();
        buttonContainer = null;
    }

    cards.sort(() => Math.random() - 0.5);

    let allCards = cards.map((icon) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.icon = icon;
        card.innerText = icon;
        board.appendChild(card);
        return card;
    });

    setTimeout(() => {
        allCards.forEach((card) => {
            card.innerText = "?";
        });
    }, 3000);

    board.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if (card) flipCard(card);
    });
}

// 타이머 시작
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 10);
}

// 타이머 업데이트
function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    timerDisplay.textContent = `시간: ${elapsed.toFixed(2)}초`;
}

// 카드 뒤집기
function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped") && !matchedCards.includes(card)) {
        card.innerText = card.dataset.icon;
        card.classList.add("flipped");
        flippedCards.push(card);

        if (!startTime) startTimer();
    }

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

// 매칭 확인
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.icon === card2.dataset.icon) {
        matchedCards.push(card1, card2);
    } else {
        card1.innerText = "?";
        card2.innerText = "?";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
    }

    flippedCards = [];

    if (matchedCards.length === cards.length) {
        clearInterval(timerInterval);
        setTimeout(showCompletionScreen, 300);
    }
}

// 완료 화면 표시
function showCompletionScreen() {
    clearInterval(timerInterval);
    updateTimer();
    timerDisplay.textContent = "";

    const elapsed = (Date.now() - startTime) / 1000;
    board.innerHTML = "";

    completionMessage = document.createElement("div");
    completionMessage.classList.add("completion-message");
    completionMessage.innerText = `축하합니다! 걸린 시간: ${elapsed.toFixed(2)}초`;
    document.body.appendChild(completionMessage);

    buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const retryBtn = document.createElement("button");
    retryBtn.classList.add("retry-btn");
    retryBtn.innerText = "다시하기";
    retryBtn.addEventListener("click", startGame);

    const homeBtn = document.createElement("button");
    homeBtn.classList.add("home-btn");
    homeBtn.innerText = "홈으로";
    homeBtn.addEventListener("click", () => window.location.href = "../index.html");

    buttonContainer.appendChild(retryBtn);
    buttonContainer.appendChild(homeBtn);
    document.body.appendChild(buttonContainer);
}