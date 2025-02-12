const startBtn = document.querySelector(".start_btn");
const board = document.querySelector(".game-board");
const timerDisplay = document.querySelector(".timer");

const icons = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🍓"];
let cards = [...icons, ...icons]; // 같은 아이콘 두 개씩 넣기
let flippedCards = [];
let matchedCards = [];
let startTime;
let timerInterval;

// 시작 버튼 클릭 시 게임 시작
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none"; // 시작 버튼 숨기기
  startGame(); // 게임 시작
});

// 게임 시작
function startGame() {
  // 카드 섞기
  cards.sort(() => Math.random() - 0.5);
  // 카드 생성
  cards.forEach((icon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.innerText = "?";

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

// 게임 시작 타이머 시작
function startTimer() {
  startTime = Date.now(); // 첫 카드 클릭 시 시간 시작
  timerInterval = setInterval(updateTimer, 10);
}

// 타이머 업데이트
function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000; // 경과 시간을 초 단위로 계산
  timerDisplay.textContent = `시간: ${elapsed.toFixed(2)}초`; // 소수점 2자리까지 표시
}

// 카드 뒤집기 함수
function flipCard(card) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped") && !matchedCards.includes(card)) {
    card.innerText = card.dataset.icon;
    card.classList.add("flipped");
    flippedCards.push(card);

    // 첫 카드 클릭 시 타이머 시작
    if (!startTime) startTimer();
  }

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 500);
  }
}

// 카드 매칭 확인
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
    clearInterval(timerInterval); // 게임 끝나면 타이머 멈춤
    setTimeout(showCompletionTime, 300); // 게임 끝난 후 시간 표시
  }
}

// 게임 완료 후 시간 표시
function showCompletionTime() {
  const elapsed = (Date.now() - startTime) / 1000;
  board.innerHTML = ''; // 모든 카드를 지우고
  const completionMessage = document.createElement("div");
  completionMessage.classList.add("completion-message");
  completionMessage.innerText = `축하합니다! 걸린 시간: ${elapsed.toFixed(2)}초`;
  document.body.appendChild(completionMessage);
}
