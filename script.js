const board = document.querySelector(".game-board");

const icons = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🍓"];
let cards = [...icons, ...icons]; // 같은 아이콘 두 개씩 넣기
let flippedCards = [];
let matchedCards = [];

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

// 카드 뒤집기 함수
function flipCard(card) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped") && !matchedCards.includes(card)) {
    card.innerText = card.dataset.icon;
    card.classList.add("flipped");
    flippedCards.push(card);
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
    setTimeout(() => alert("축하합니다! 모든 카드를 맞췄어요!"), 300);
  }
}
