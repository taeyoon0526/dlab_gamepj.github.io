const startBtn = document.querySelector(".start_btn");
const board = document.querySelector(".game-board");
const timerDisplay = document.querySelector(".timer");

const icons = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🍓"];
let cards = [...icons, ...icons]; // 같은 아이콘 두 개씩 넣기
let flippedCards = [];
let matchedCards = [];
let startTime;
let timerInterval;
let buttonContainer = null;
let completionMessage = null;

// 시작 버튼 클릭 시 게임 시작
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none"; // 시작 버튼 숨기기
  startGame(); // 게임 시작
});

// 게임 시작
function startGame() {
  // 기존 UI 초기화
  board.innerHTML = ""; // 기존 카드 초기화
  flippedCards = [];
  matchedCards = [];
  startTime = null;
  clearInterval(timerInterval);
  timerDisplay.textContent = "시간: 0.00초";

  // 축하 메시지 제거
  if (completionMessage) {
    completionMessage.remove();
    completionMessage = null;
  }

  // 버튼 컨테이너 제거
  if (buttonContainer) {
    buttonContainer.remove();
    buttonContainer = null;
  }

  // 카드 섞기
  cards.sort(() => Math.random() - 0.5);

  // 카드 생성
  let allCards = cards.map((icon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.innerText = icon; // 처음에는 아이콘 보이기
    board.appendChild(card);
    return card;
  });

  // 3초 후에 카드 뒤집기
  setTimeout(() => {
    allCards.forEach((card) => {
      card.innerText = "?";
      card.addEventListener("click", () => flipCard(card));
    });
  }, 3000);
}

// 타이머 시작
function startTimer() {
  startTime = Date.now();
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
    setTimeout(showCompletionScreen, 300); // 게임 끝난 후 화면 표시
  }
}

// 게임 완료 후 화면 표시
function showCompletionScreen() {
  const elapsed = (Date.now() - startTime) / 1000;
  board.innerHTML = ''; // 모든 카드를 지우고

  // 축하 메시지 생성 및 저장
  completionMessage = document.createElement("div");
  completionMessage.classList.add("completion-message");
  completionMessage.innerText = `축하합니다! 걸린 시간: ${elapsed.toFixed(2)}초`;
  document.body.appendChild(completionMessage);

  // 버튼 컨테이너 생성
  buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // 다시하기 버튼 생성
  const retryBtn = document.createElement("button");
  retryBtn.classList.add("retry-btn");
  retryBtn.innerText = "다시하기";
  retryBtn.addEventListener("click", startGame);

  // 홈 버튼 생성
  const homeBtn = document.createElement("a");
  homeBtn.classList.add("home-btn");
  homeBtn.href = "dlab_gamepj/index.html";
  homeBtn.innerText = "홈으로";

  // 버튼 추가
  buttonContainer.appendChild(retryBtn);
  buttonContainer.appendChild(homeBtn);
  document.body.appendChild(buttonContainer);
}
