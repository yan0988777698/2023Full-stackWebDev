const canvas = document.getElementById("myCanvas");

const ctx = canvas.getContext("2d");
//getContext() method會回傳一個convas的drawing context
//drawing context可以用來在convas內畫圖

const unit = 20; //方塊單位長度
const row = canvas.height / unit; // 320/20=16行 row
const column = canvas.width / unit; // 320/20=16行 column

let snake = []; //array中的每個元素，都是一個物件
//物件的工作是儲存身體的 x, y 座標
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}
//初始設定
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
let direction = "Right";
function changeDirection(e) {
  if (e.key == "ArrowLeft" && direction != "Right") {
    direction = "Left";
  } else if (e.key == "ArrowRight" && direction != "Left") {
    direction = "Right";
  } else if (e.key == "ArrowUp" && direction != "Down") {
    direction = "Up";
  } else if (e.key == "ArrowDown" && direction != "Up") {
    direction = "Down";
  }
  //每次按下方向鍵後，在下一幀被畫出來之前，不接受任何keydown事件
  //防止連續按鍵導致自殺
  window.removeEventListener("keydown", changeDirection);
}
let highestScore;
loadHighestScore();

let score = 0;

document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
document.getElementById("topScore").innerHTML = "最高分數:" + highestScore;
function draw() {
  //畫圖前，確認有沒有咬到自己 -> 一定要放在 draw() 的開頭
  //網頁畫面是在 draw() 執行完畢或者是被 return 之後才會更新的
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }
  //背景全設定為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //畫出果實
  myFruit.drawFruit();
  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    //方塊顏色設定
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    //方塊外框設定
    ctx.strokeStyle = "white";
    //在畫出方塊前，確認方塊是否在畫布內
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //畫出方塊 (x座標, y座標, 長, 寬)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    //畫出方塊的外框 (x座標, y座標, 長, 寬)
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //以目前direction的變數方向，來決定蛇的下一幀要放在哪個座標
  let sankeX = snake[0].x; //sanke[0]是一個物件，但是snake[0].x是一個number(pirimitive data type)
  let sankeY = snake[0].y;
  if (direction == "Left") {
    sankeX -= unit; //改變snakeX的值並不會改變snake[0].x的值
  } else if (direction == "Up") {
    sankeY -= unit;
  } else if (direction == "Right") {
    sankeX += unit;
  } else if (direction == "Down") {
    sankeY += unit;
  }
  let newHead = {
    x: sankeX,
    y: sankeY,
  };
  //確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //選定果實位置
    myFruit.pickALocation();
    //改變分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
    document.getElementById("topScore").innerHTML = "最高分數:" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = window.setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
