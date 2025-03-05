// 원주율 데이터(2000자리)
const piDigits =
  "3141592653589793238462643383279502884197169399375105820974944592" +
  "307816406286" + "208998628034825342117067982148086513282306647" +
  "093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165" +
  "2712019091456485669234603486104543266482133936072" +
  "60249141273724587006606315588174881520920962829254091715364367892590360" +
  "011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724" +
  "89122793818301194912983" +
  "3673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132" +
  "000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960" +
  "86403441815981362977" +
  "4771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035" +
  "261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532" +
  "17122680661300192787661" +
  "1195909216420198938095257201065485863278865936153381827968230301952035301852968995773622599413891" +
  "249721775283479131515574857242454150695950829533116861727855889075098381754637464939319255060400927701671139009848824012" +
  "85836160356370766010471018" +
  "1942955596198946767837449448255379774726847104047534646208046684259069491293313677028989152104" +
  "752162056966024058038150193511253382430035587640247496473263914199272604269922796782354781636009341721641219924586315030" +
  "286182974555706749838505494" +
  "588586926995690927210797509302955321165344987202755960236480665499119881834797753566369807426" +
  "542527862551818417574672890977772793800081647060016145249192173217214772350141441973568548161361157352552133475741849468" +
  "4385233239073941433345477624" +
  "16862518983569485562099219222184272550254256887671790494601653466804988627232791786085784383" +
  "8279679766814541009";

// HTML 요소 가져오기
const modeSelection = document.getElementById("modeSelection");
const timeModeBtn = document.getElementById("timeModeBtn");
const speedModeBtn = document.getElementById("speedModeBtn");
const timeSelect = document.getElementById("timeSelect");
const lengthSelect = document.getElementById("lengthSelect");
const studyBtn = document.getElementById("studyBtn");

const gameContainer = document.getElementById("gameContainer");
const gameTitle = document.getElementById("gameTitle");
const scoreBoard = document.getElementById("scoreBoard");
const currentScoreElem = document.getElementById("currentScore");
const timeLabel = document.getElementById("timeLabel");

const keypad = document.getElementById("keypad");
const backToMenuBtn = document.getElementById("backToMenuBtn");

const resultContainer = document.getElementById("resultContainer");
const finalMessageElem = document.getElementById("finalMessage");
const finalScoreElem = document.getElementById("finalScore");
const bestScoreElem = document.getElementById("bestScore");

const rankingInput = document.getElementById("rankingInput");
const userNameInput = document.getElementById("userName");
const rankSubmitBtn = document.getElementById("rankSubmitBtn");
const noRankBtn = document.getElementById("noRankBtn");
const rankingDisplay = document.getElementById("rankingDisplay");
const rankList = document.getElementById("rankList");

const playAgainBtn = document.getElementById("playAgainBtn");
const menuBtn = document.getElementById("menuBtn");

let gameMode = null;      // 'time' 또는 'speed'
let currentIndex = 1;
let targetValue = 0;
let timerId = null;
let timerRunning = false;
let startTime = 0;
let elapsedMs = 0;
let timeLeftMs = 0;

/* 
  랭킹 관리 (조건별 구분)
  예) time 모드 30초 → ranking_time_30
      speed 모드 50자리 → ranking_speed_50
*/
// 랭킹 데이터 불러오기
function loadRanking(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// 랭킹 데이터 저장하기
function saveRanking(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

// 랭킹에 새 기록 추가하기
function addRanking(key, name, score, isTimeMode) {
  const ranking = loadRanking(key);
  ranking.push({ name, score });
  // time 모드: 점수가 큰 것이 상위, speed 모드: 점수가 작은 것이 상위
  if (isTimeMode) {
    ranking.sort((a, b) => b.score - a.score);
  } else {
    ranking.sort((a, b) => a.score - b.score);
  }
  // 상위 5개의 기록만 유지
  saveRanking(key, ranking.slice(0, 5));
}

// 랭킹 데이터 화면에 표시하기
function displayRanking(key, isTimeMode) {
  const ranking = loadRanking(key);
  rankList.innerHTML = "";
  ranking.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}위: ${item.name} - ${item.score}`;
    rankList.appendChild(li);
  });
}

/* 키패드 생성 */
function createKeypad() {
  for (let i = 1; i <= 9; i++) {
    const key = document.createElement("div");
    key.className = "key";
    key.textContent = i;
    key.addEventListener("click", () => handleUserInput(i.toString()));
    keypad.appendChild(key);
  }
  const zeroKey = document.createElement("div");
  zeroKey.className = "key";
  zeroKey.textContent = "0";
  zeroKey.addEventListener("click", () => handleUserInput("0"));
  keypad.appendChild(zeroKey);
}
createKeypad();

/* 모드 시작 */
function startGame(mode) {
  gameMode = mode;
  currentIndex = 1;
  timerRunning = false;
  elapsedMs = 0;

  modeSelection.style.display = "none";
  resultContainer.style.display = "none";
  gameContainer.style.display = "block";
  rankingDisplay.style.display = "none";
  rankingInput.style.display = "block";
  userNameInput.value = "";

  if (gameMode === "time") {
    gameTitle.textContent = "시간 제한 모드";
    targetValue = parseInt(timeSelect.value, 10);
    timeLeftMs = targetValue * 1000;
    timeLabel.textContent = `남은 시간: ${(timeLeftMs / 1000).toFixed(2)}초`;
  } else {
    gameTitle.textContent = "스피드 모드";
    targetValue = parseInt(lengthSelect.value, 10);
    timeLabel.textContent = `경과 시간: 0.00초`;
  }
  currentScoreElem.textContent = 0;
}

/* 타이머 시작 */
function startTimer() {
  timerRunning = true;
  startTime = performance.now();
  timerId = setInterval(updateTimer, 10);
}

/* 타이머 업데이트 (0.01초 간격) */
function updateTimer() {
  if (gameMode === "time") {
    const now = performance.now();
    const diff = now - startTime;
    startTime = now;
    timeLeftMs -= diff;
    if (timeLeftMs < 0) timeLeftMs = 0;
    timeLabel.textContent = `남은 시간: ${(timeLeftMs / 1000).toFixed(2)}초`;
    if (timeLeftMs <= 0) {
      endGame();
    }
  } else {
    const now = performance.now();
    elapsedMs = now - startTime;
    timeLabel.textContent = `경과 시간: ${(elapsedMs / 1000).toFixed(2)}초`;
  }
}

/* 숫자 입력 처리 */
function handleUserInput(digit) {
  if (!timerRunning) {
    startTimer();
  }
  const correct = piDigits[currentIndex];
  if (digit === correct) {
    currentIndex++;
    currentScoreElem.textContent = currentIndex - 1;
    if (gameMode === "speed" && (currentIndex - 1) >= targetValue) {
      endGame();
    }
  } else {
    if (gameMode === "time") {
      timeLeftMs -= 1000;
      if (timeLeftMs < 0) timeLeftMs = 0;
      timeLabel.textContent = `남은 시간: ${(timeLeftMs / 1000).toFixed(2)}초`;
      if (timeLeftMs <= 0) {
        endGame();
      }
    }
  }
}

/* 게임 종료 */
function endGame() {
  clearInterval(timerId);
  timerId = null;
  gameContainer.style.display = "none";
  resultContainer.style.display = "block";

  let thisScore = 0;
  if (gameMode === "time") {
    thisScore = currentIndex - 1;
    finalMessageElem.textContent = `시간 제한 ${targetValue}초 모드 종료`;
    finalScoreElem.textContent = thisScore;
    const bestKey = `bestTimeMode_${targetValue}`;
    let bestScore = localStorage.getItem(bestKey);
    if (bestScore === null || thisScore > Number(bestScore)) {
      bestScore = thisScore;
      localStorage.setItem(bestKey, bestScore);
    }
    bestScoreElem.textContent = bestScore;
  } else {
    thisScore = elapsedMs / 1000;
    finalMessageElem.textContent = `스피드 ${targetValue}자리 모드 종료`;
    finalScoreElem.textContent = thisScore.toFixed(2);
    const bestKey = `bestSpeedMode_${targetValue}`;
    let bestScore = localStorage.getItem(bestKey);
    if (bestScore === null || thisScore < Number(bestScore)) {
      bestScore = thisScore;
      localStorage.setItem(bestKey, bestScore);
    }
    bestScoreElem.textContent = bestScore;
  }
}

/* 이벤트 바인딩 */
timeModeBtn.addEventListener("click", () => startGame("time"));
speedModeBtn.addEventListener("click", () => startGame("speed"));
backToMenuBtn.addEventListener("click", () => {
  if (timerId) clearInterval(timerId);
  gameContainer.style.display = "none";
  resultContainer.style.display = "none";
  modeSelection.style.display = "block";
});

/* 랭킹 등록 */
rankSubmitBtn.addEventListener("click", () => {
  let scoreVal;
  if (gameMode === "time") {
    scoreVal = parseInt(finalScoreElem.textContent, 10);
    const rankKey = `ranking_time_${targetValue}`;
    addRanking(rankKey, userNameInput.value || "익명", scoreVal, true);
    displayRanking(rankKey, true);
  } else {
    scoreVal = parseFloat(finalScoreElem.textContent);
    const rankKey = `ranking_speed_${targetValue}`;
    addRanking(rankKey, userNameInput.value || "익명", scoreVal, false);
    displayRanking(rankKey, false);
    
  }
  rankingInput.style.display = "none";
  rankingDisplay.style.display = "block";
});
noRankBtn.addEventListener("click", () => {
  rankingInput.style.display = "none";
  rankingDisplay.style.display = "none";
});
playAgainBtn.addEventListener("click", () => {
  startGame(gameMode);
});
menuBtn.addEventListener("click", () => {
  resultContainer.style.display = "none";
  modeSelection.style.display = "block";
});

/* 원주율 도감 페이지로 이동 */
studyBtn.addEventListener("click", () => {
  window.location.href = "pi_dictionary.html";
});
