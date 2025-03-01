const startBtn = document.querySelector(".btn"); // "게임 시작" 버튼
const board = document.querySelector(".game-board");
const timerDisplay = document.querySelector(".timer");
const menuBtn = document.querySelector(".menu-btn"); // "메뉴 화면으로" 버튼
const stage1Btn = document.querySelector(".stage1-btn");

const icons = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐵", "🐮", "🐷", "🐸"];
let cards = [...icons, ...icons.slice(0, 12)]; // 25장 (13쌍 + 12개 중복으로 안정성 강화)
let flippedCards = [];
let matchedCards = [];
let startTime = null; // null로 초기화, 게임 시작 시 설정
let timerInterval;
let buttonContainer = null;
let completionMessage = null;
let isClickable = false; // 카드 클릭 가능 여부 플래그

// 시작 버튼 클릭 시 게임 시작
startBtn.addEventListener("click", () => {
    if (!startBtn || !menuBtn) {
        console.error("버튼 요소를 찾을 수 없습니다.");
        return;
    }
    startBtn.style.display = "none";
    menuBtn.style.display = "none";
    startGame();
});

// 스테이지1 버튼 클릭 시 스테이지 1로 이동
stage1Btn.addEventListener("click", () => {
    window.location.href = "../../memory/stage_1/index.html";
});

// 메뉴 버튼 클릭 시 메뉴 화면으로 이동
menuBtn.addEventListener("click", () => {
    window.location.href = "/dlab_gamepj.github.io/index.html"; // memory/ 상위로 이동 (루트 index.html)
});

// 게임 시작
function startGame() {
    if (!board || !timerDisplay) {
        console.error("게임 보드 또는 타이머 요소를 찾을 수 없습니다.");
        return;
    }

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

    if (stage1Btn) {
        stage1Btn.remove();
    }

    cards.sort(() => Math.random() - 0.5);

    let allCards = cards.map((icon, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.icon = icon;
        card.dataset.index = index; // 디버깅용 인덱스 추가
        card.innerText = icon;
        board.appendChild(card);
        return card;
    });

    console.log("카드 생성 완료, 총 카드 수:", allCards.length); // 디버깅 로그

    // 5초 지연 후 카드 숨김 확인
    isClickable = false; // 5초 동안 클릭 비활성화
    setTimeout(() => {
        allCards.forEach((card) => {
            card.innerText = "?";
        });
        isClickable = true; // 5초 후 클릭 활성화
        console.log("카드 클릭 활성화");
    }, 5000);

    board.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if (card && isClickable) flipCard(card); // 클릭 가능 여부 확인 후 뒤집기
    });
}

// 타이머 시작
function startTimer() {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100); // 100ms로 조정 (성능 최적화)
        console.log("타이머 시작:", startTime);
    }
}

// 타이머 업데이트
function updateTimer() {
    if (!startTime) return;
    const elapsed = (Date.now() - startTime) / 1000;
    timerDisplay.textContent = `시간: ${elapsed.toFixed(2)}초`;
    console.log("타이머 업데이트:", elapsed.toFixed(2));
}

// 카드 뒤집기
function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped") && !matchedCards.includes(card)) {
        card.innerText = card.dataset.icon || "?"; // 데이터가 없으면 "?"로 대체
        card.classList.add("flipped");
        flippedCards.push(card);

        if (!startTime) startTimer(); // 타이머 시작
        console.log("카드 뒤집기:", card.dataset.icon, "인덱스:", card.dataset.index);
    }

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

// 매칭 확인
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (!card1 || !card2) {
        console.error("카드 매칭 오류");
        return;
    }

    if (card1.dataset.icon === card2.dataset.icon) {
        matchedCards.push(card1, card2);
        console.log("매칭 성공:", card1.dataset.icon);
    } else {
        card1.innerText = "?";
        card2.innerText = "?";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        console.log("매칭 실패:", card1.dataset.icon, "와", card2.dataset.icon);
    }

    flippedCards = [];

    // 24장 매칭 후 마지막 카드 자동 뒤집기
    if (matchedCards.length === cards.length - 1) {
        const remainingCard = document.querySelector(".card:not(.flipped)");
        if (remainingCard) {
            remainingCard.innerText = remainingCard.dataset.icon;
            remainingCard.classList.add("flipped");
            matchedCards.push(remainingCard);
            console.log("마지막 카드 자동 뒤집기:", remainingCard.dataset.icon);
        }
        clearInterval(timerInterval);
        console.log("게임 완료, 총 시간:", (Date.now() - startTime) / 1000);
        setTimeout(showCompletionScreen, 300);
    }
}

// 완료 화면 표시
function showCompletionScreen() {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    updateTimer();
    timerDisplay.textContent = "";

    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
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
    homeBtn.addEventListener("click", () => {
        window.location.href = "/index.html"; // 루트의 index.html로 이동
    });

    buttonContainer.appendChild(retryBtn);
    buttonContainer.appendChild(homeBtn);

    // 30초 이하로 클리어 시 "다음 스테이지" 버튼 추가 (추가 스테이지가 없다고 가정)
    if (elapsed <= 30) {
        const nextStageBtn = document.createElement("button");
        nextStageBtn.classList.add("next-stage-btn");
        nextStageBtn.innerText = "다음 스테이지";
        nextStageBtn.addEventListener("click", () => {
            alert("마지막 스테이지입니다!"); // 더 이상 스테이지가 없다고 알림
        });
        buttonContainer.appendChild(nextStageBtn);
    }

    document.body.appendChild(buttonContainer);
    startTime = null; // 타이머 초기화
    console.log("완료 화면 표시, 걸린 시간:", elapsed.toFixed(2));
}