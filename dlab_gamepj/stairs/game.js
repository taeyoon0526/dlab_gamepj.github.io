const start_button = document.querySelector(".start_button");
const background_size = document.querySelector(".game-screen");

// 전역 상수
const BULLET_SPEED = 500;

class Player { //전체 플레이어 움직임 제어 클래스 생성, class에는 필요한 변수를 마련하는 constructor(), 플레이어의 포지션을 바꿔주는 updatePosition(),
    //이 딜레이를 1000으로 나눈 deltaTime으로 플레이어의 움직임을 담당하는 move() 함수가 있음
    constructor() {
        this.player = document.getElementById('player'); //html객체에서 player이라는 id를 가진 객체를 불러와 위치를 선정함
        this.posX = 750;
        this.posY = 500;
        this.speed = 300; //초당 이동 가능거리, 여기선 델타 타임이 60fps라면 0.0167초(60fps에서 한 프레임의 시간일 때)라면,
        //  moveDistance는 200 * 0.0167 = 3.34 픽셀이 된다. 즉, 이 프레임에서는 3.34픽셀만큼 이동한다는 의미이다.
        this.direction = { left: false, right: false, up: false, down: false }; //맨 처음 플레이어가 가려는 방향을 설정함, 
        // 맨처음 플레이어는 가만히 있으니 당연히 모든게 false.
    }

    setup() {
        this.player.style.display = 'block'; //플레이어를 화면에 보이게하고, 플레이어의 좌표(x,y)를 변경시킬 수 있게 포지션을 absolute로 설정함
        this.player.style.position = "absolute";
        document.body.appendChild(this.player); //appendChild는 player노드의 부모노드인(html상) body노드에 this.player라는 노드를 추가한다.
        //여기서 노드란? -> 사이트로 보내지기 전 설계서인 DOM요소를 나타내는 트리의 각 요소(div,body,h2,head,html 등등)
        //그러니깐 정리하면 사이트로 this.player라는 플레이어의 설계가 보내질 수 있게 body라는 부모노드에 추가해준 것
        //더 자세한 설명은 공부탭으로,하나만 말하자면 이게 innerHtml보다 더 효율적일 수 있고, 외부 상태 영향 X, DOM설계의 기초 등등 좋은 점이 매우 많다.
        this.updatePosition(); //플레이어의 포지션을 업데이트
    }

    updatePosition() {
        this.player.style.left = `${this.posX}px`; //플레이어의 left방향을 가져오는 하나의 방법이다. style은 Html의 요소중 left, 즉 좌우로 가는 걸 가져오는거다.
        this.player.style.top = `${this.posY}px`; //얘도 똑같다.(단지 위,아래를 관장하는것만 바뀔뿐, 이걸 쓴 덕분에 코드가 조금더 구조화됨)
    }

    move(deltaTime) { //deltaTime은 프레임간의 경과 시간을 나타낸다. 이를 플레이어가 픽셀을 이동하는 속도에 곱해 조금더 부드러운 모션을 만든다.
        const moveDistance = this.speed * deltaTime;//스피드에 프레임을 곱해 플레이어가 이동하는 시간을 만들어 낸다. 꾹 누르고 있어도 이 deltaTime이 지나게 되면
        //플레이어가 계속 움직인다.
        if (this.direction.left && this.posX > 68) this.posX -= moveDistance;
        if (this.direction.right && this.posX < background_size.offsetWidth - 68) this.posX += moveDistance;
        if (this.direction.up && this.posY > 150) this.posY -= moveDistance;
        if (this.direction.down && this.posY < 640) this.posY += moveDistance;
        //얘는 아까 내가 썼돈 조건문.. 설명하자면 화면 밖으로 일정 이상 못나가게 하는거다. 왼쪽 오른쪽 위 아래 다 막아놨다.
        this.updatePosition(); //움직였으니깐 움직이는걸 px로 가져온다.
    }
}
//이 클래스에서 모르는거 있음 만들때 생긴 오류 -> 총알.txt로
class Bullet {
    constructor(dir) {
        this.element = document.createElement('div'); //담을 박스 생성
        this.element.className = 'bullet';
        this.dir = dir
        if (this.dir === "horizontal") {
            this.posX = 68  // -700 ~ 700까지의 난수 생성
            this.posY = Math.floor(Math.random() * 1500) + 120; // 초기 y 위치
        } else if (this.dir === "vertical") {
            this.posX = Math.floor(Math.random() * 1500) - 150  // -700 ~ 700까지의 난수 생성
            this.posY = 10; // 초기 y 위치
        } else if (this.dir === "horizontal_1") {
            this.posX = 1540  // -700 ~ 700까지의 난수 생성  // -700 ~ 700까지의 난수 생성
            this.posY = Math.floor(Math.random() * 1500) + 120; // 초기 y 위치
        }
        this.speed = BULLET_SPEED;
        document.getElementById('bullets-container').appendChild(this.element); // 컨테이너에 자식 노드로 추가
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.posX}px`;
        this.element.style.top = `${this.posY}px`;
    }

    move(deltaTime) {
        const bulletMoveDistance = this.speed * deltaTime; //움직일 거리 정해주기
        if (this.dir === "vertical") {
            this.posY += bulletMoveDistance; //움직여주기
            if (this.posY > 640) {
                this.remove(); //밖으로 나가면 총알 지워주기
            }
        } else if (this.dir === "horizontal") {
            this.posX += bulletMoveDistance; //움직여주기
            if (this.posX > background_size.offsetWidth) {
                this.remove(); //밖으로 나가면 총알 지워주기
            }
        } else if (this.dir === "horizontal_1") {
            this.posX -= bulletMoveDistance; //움직여주기
            if (this.posX > background_size.offsetWidth) {
                this.remove(); //밖으로 나가면 총알 지워주기
            }
        }
        this.updatePosition(); //움직이고 움직인거 업데이트(화면에)
    }


    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element); //부모노드에서 this.element라는 자식 노드를 완전히 제거
        }
    }

    colliderect(player) { //이건 불리언값을 반환하는거임, 닿으면 trye,안닿으면 false
        const playerRect = player.player.getBoundingClientRect();
        const bulletRect = this.element.getBoundingClientRect();
        return !(playerRect.right < bulletRect.left ||
            playerRect.left > bulletRect.right ||
            playerRect.bottom < bulletRect.top ||
            playerRect.top > bulletRect.bottom);
    }
}


class Game { //본격적으로 게임을 실행하는 공간이다.
    constructor() { //player클래스의 메서드를을 쓰기 쉽에 this.player에다 넣어준다.
        this.player = new Player();
        this.bgm = document.getElementById('bgm'); //이건 브금트는거, html에서 audio라고 설정해놓은 id가 bgm인 
        this.bullets = []; // 총알 배열
        this.bulletSpawnTime = 0; // 총알 생성 타이머
        this.lastTime = performance.now(); //현재 시간과 몇 미리세컨트밖에 차이가 안나는 시간을 이벤트가 발생한 마지막 시간으로 규정함
        this.isRunning = false;
    }

    startGame() { //게임 시작하는 함수, 기본적인것들을 실행해준다.
        start_button.addEventListener("click", () => { //버튼을 클릭하면 괄호안에 있는 bgm틀기, 키보드세팅함수 호출하기, 게임시작하기,
            // gameLoop함수에 현재 시간을 넣어주는 코드가 들어있다.
            document.getElementById('start').style.display = 'none';
            this.bgm.play();
            this.player.setup();
            this.setupKeyboard();
            this.second = 0;
            this.second_time = 0;
            this.wave = 0;
            this.WaveScore = 0;
            this.WaveTime = 10;
            this.WaveChange = 0;
            this.BULLET_INTERVAL = 0.3;
            this.intervalTimer = 0;
            this.isRunning = true;
            this.score = 0;
            this.ScoreTime = 0;
            this.bulletSpawnTime = 0;
            this.bullets = [];
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(this.gameLoop.bind(this));
        });
    }

    setupKeyboard() { //셋업키보드함수, 
        const updateDirection = (dir, value) => this.player.direction[dir] = value; //여기서 방향과 값을 입력 받으면, player.direction의 dir번 인덱스가
        //적은 값으로 전환됨(매개변수로 전환됨)
        //해당방향 비활성화, 활성화 유무에 따라 플레이어가 움직임 this.player.direction[dir] = true/false;
        const keyMap = {
            'ArrowLeft': 'left', 'ArrowRight': 'right', //방향키를 눌렀을떄 => 움직일 방향 설정
            'ArrowUp': 'up', 'ArrowDown': 'down'
        };

        document.addEventListener("keydown", e => updateDirection(keyMap[e.code], true)); //아래로 가는 키를 눌렀을때(keydown이벤트 실행)
        //키를 누르면 이벤트 발생 -> updatedirection함수로 들어가 이 함수안에 있는 키코드를 누른 코드에 따라 방향 문자열로 전환(매핑) 시켜주는 코드
        //뒤로는 true를 붙여서 해당방향으로 가고있다는것을 나타냄
        document.addEventListener("keyup", e => updateDirection(keyMap[e.code], false)); //키에서 손땠을때는 더이상 키를 누르지 않기 때문에, 
        //updatedirection(){}으로 들어간 매핑된 키코드가 활성화되지 않았다는것(줄여서 키보드에서 손 떔)을 나타냄(false)
    }
    updateScore() {
        document.getElementById('score').innerHTML = `점수: ${this.score}`; // 직접 getElementById 호출
    }
    updateWave() {
        document.getElementById('wave').innerHTML = `Wave : ${this.wave}`;
    }
    updateSecond() {
        document.getElementById('second').innerHTML = `버틴시간 : ${this.second}초`;
    }
    gameLoop(time) { //gameLoop 함수에서 time 매개변수는 requestAnimationFrame에 의해 쓰임(브라우저가 시작되고 난 시간을 잼)
        if (!this.isRunning) return; //게임이 실행되지 않으면 게임을 종료해주는 기능, !을 넣은 이유는 부정연산자때문에 그럼
        //(만약 게임이 더 이상 진행되지 않고 있다는 값이 들어오면 게임을 종료함)

        const deltaTime = (time - this.lastTime) / 1000; //딜레이를 1000으로 나눠서 현재시간으로 계산함으로써, 플레이어가 움직일떄 나는 딜레이를 1/1000으로 줄임
        this.lastTime = time;
        this.bulletSpawnTime += deltaTime;

        this.intervalTimer += deltaTime;
        if (this.intervalTimer >= 10) {
            this.BULLET_INTERVAL = this.BULLET_INTERVAL *= 0.8;
            this.intervalTimer = 0; // 타이머 리셋
        }
        if (this.bulletSpawnTime >= this.BULLET_INTERVAL) {
            if (this.wave <= 2) {
                const bullet = new Bullet("vertical"); // 인스턴스 생성
                this.bullets.push(bullet); // 배열에 추가
            } else if (this.wave > 2){
                if (Math.random() < 0.5) {
                    const bullet = new Bullet("horizontal"); // 인스턴스 생성
                    this.bullets.push(bullet); // 배열에 추가
                }
                if (Math.random() < 0.5) {
                    const bullet = new Bullet("vertical"); // 인스턴스 생성
                    this.bullets.push(bullet); // 배열에 추가
                }
            } else if (this.wave > 7){
                if (Math.random() < 0.5) {
                    const bullet = new Bullet("horizontal"); // 인스턴스 생성
                    this.bullets.push(bullet); // 배열에 추가
                }
                if (Math.random() < 0.5) {
                    const bullet = new Bullet("vertical"); // 인스턴스 생성
                    this.bullets.push(bullet); // 배열에 추가
                }
                if (Math.random() < 0.5) {
                    const bullet = new Bullet("horizontal_1"); // 인스턴스 생성
                    this.bullets.push(bullet); // 배열에 추가
                }
            } else if (this.wave == 10){
                if (Math.random() < 1) {
                    const bullet = new Bullet("horizontal"); // 인스턴스 생성
                    this.bullets.push(bullet); // 배열에 추가
                }
                if (Math.random() < 1) {
                    const bullet = new Bullet("vertical"); // 인스턴스 생성
                    this.bullets.push(bullet); // 배열에 추가
                }
                if (Math.random() < 1) {
                    const bullet = new Bullet("horizontal_1"); // 인스턴스 생성
                    this.bullets.push(bullet); // 배열에 추가
                }
            }
            this.bulletSpawnTime = 0;
        }

        this.WaveChange += deltaTime;
        if (this.WaveChange >= this.WaveTime) {
            this.wave += 1;
            this.updateWave();
            this.WaveChange = 0;
        }

        this.second_time += deltaTime;
        if (this.second_time >= 1.000) {
            this.second += 1.000;
            this.updateSecond();
            this.second_time = 0;
        }
        this.ScoreTime += deltaTime;
        if (this.ScoreTime >= 0.1) {
            if (this.wave == 1) {
                this.score += 1;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 2) {
                this.score += 2;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 3) {
                this.score += 3;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 4) {
                this.score += 3;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 5) {
                this.score += 4;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 6) {
                this.score += 4;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 7) {
                this.score += 4;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 8) {
                this.score += 5;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 9) {
                this.score += 6;
                this.updateScore();
                this.ScoreTime = 0;
            } else if (this.wave == 10) {
                this.score += 7;
                this.updateScore();
                this.ScoreTime = 0;
            }

        }
        if (this.wave >= 10) {
            alert("와우! 10웨이브를 다 깼어요!");
            this.isRunning = false;
            window.location.href = "index.html";
        }

        this.player.move(deltaTime); //플레이어의 스피드가 deltaTime(즉 흐른 시간에 곱해질 수 있도록 매개변수로 넣어줌)

        this.bullets.forEach((bullet, index) => {
            bullet.move(deltaTime);
            if (bullet.posY > 640) {
                this.bullets.splice(index, 1);
                bullet.remove();
            } else if (bullet.colliderect(this.player)) {
                alert("게임이 종료되었습니다!");
                let scores = JSON.parse(localStorage.getItem('scores')) || [];
                scores.push(this.score);
                localStorage.setItem('scores', JSON.stringify(scores));
                this.isRunning = false;
                this.player.player.style.display = 'none';
                bullet.remove();
                this.bullets.splice(index, 1);
                document.body.style.overflow = 'auto';
                window.location.href = "index.html"; // 게임 종료 시 project.html로 이동
                return;
            }
        });
        requestAnimationFrame(this.gameLoop.bind(this)); //다음 애니메이션 프레임에서 브라우저에 gameloop메서드를 호출하도록 브라우저에 요청함
        //this.gameLoop.bind(this)얘는 gameLoop가 호출될 때 this가 원래의 Game 객체를 참조하도록 보장됨(변질 X)
        //정리하자면 다음프레임이 호출될대, 사이트에서 Gameloop를 호출하도록 요청하는데, bind를 사용하면 
        // gameLoop가 호출될 때 this가 원래의 Game 객체를 참조하도록 보장한다.
    }
}

const game = new Game();
game.startGame(); //Game클래스를 game이라는 변수에 할당하고, game.StartGame로 게임을 초기화하고 다시 시작할 수 있도록 함.