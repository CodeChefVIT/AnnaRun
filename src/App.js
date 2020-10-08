import React from 'react';
import Sketch from 'react-p5';

function App() {
  let font, font2, anna, annaG, chai, coffee, pac, pac1;
  let gameState = "SS";
  let score = 0;
  let end_text = "Game Over";
  let pacman;
  let standardSize;
  let Blocks = [];
  let Foods = [];
  let Powers = [];
  let Enemies = [];
  let Gates = [];
  let levelNo = 1;
  let len = 0;
  let dir = 'LEFT';
  let enemInterval;
  let firedAgain = false;
  let rotateVar = 0;
  let rotateDir = 0;

  const preload = p5 => {
    font = p5.loadFont("/fonts/Raleway-Regular.ttf");
    font2 = p5.loadFont("/fonts/Tangerine-Bold.ttf");
    anna = p5.loadImage("/images/anna.svg");
    annaG = p5.loadImage("/images/anna-grey.svg");
    chai = p5.loadImage("/images/chai.svg");
    coffee = p5.loadImage("/images/coffee.svg");
    pac1 = p5.loadImage("/images/pac.gif");
    pac = p5.loadImage("/images/pac-left.gif");
  };

  const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

  const setup = (p5, canvasParentRef) => {
    var vw, vh;
    if (11 * p5.windowHeight / 7 < p5.windowWidth) {
      standardSize = p5.windowHeight / 14;
    } else {
      standardSize = p5.windowWidth / 22;
    }
    vw = standardSize * 22;
    vh = standardSize * 14;
    p5.createCanvas(vw, vh, p5.WEBGL).parent(canvasParentRef);
    p5.textFont(font);
    p5.textAlign(p5.CENTER);
    p5.textSize(standardSize * 0.5);
    p5.strokeWeight(0);
    p5.fill(252);
    maze(p5);
    CheckOrientaion(p5);
  };
  const draw = p5 => {
    p5.background(0)
    if (gameState === "SS") {
      StartScreen(p5);
    } else if (gameState === "LevelSplash") {
      LevelSplash(p5);
    } else if (gameState === "game") {
      GameScreen(p5);
    } else if (gameState === "go") {
      GameOver(p5);
    } else if (gameState === "Rotate") {
      Rotate(p5);
    }
  };

  const StartScreen = (p5) => {
    p5.fill(255);
    clearInterval(enemInterval);
    p5.text("TAP OR PRESS ENTER TO START", 0, 0)
    if (localStorage.getItem('highscore') !== null) p5.text(`HighScore ${localStorage.getItem('highscore')}`, 0, 50);
  };

  const GameScreen = (p5) => {
    p5.fill(255, 255, 255)
    p5.text('Score: ' + score, -9 * standardSize, -25 * standardSize / 4);
    p5.text('Level: ' + levelNo, 9 * standardSize, -25 * standardSize / 4);
    createMaze(p5);
    if (Foods.length === 0 && levelNo === 3) {
      gameState = "go";
      end_text = "You Win";
    } else if (Foods.length === 0) {
      levelNo++;
      maze(p5);
      Start_Resume(p5);
    }
    p5.frameRate(4);
    movePac(p5, dir);
  };

  const CheckOrientaion = (p5) => {
    if (p5.windowWidth < p5.windowHeight && p5.windowWidth < 600) {
      p5.resizeCanvas(p5.windowWidth - 10, p5.windowHeight - 10);
      p5.textSize(30);
      gameState = 'Rotate';
    }
  }

  const Rotate = (p5) => {
    if (rotateDir === 0) {
      rotateVar += 0.1;
      if (rotateVar >= 2) rotateDir = 1;
    } else {
      rotateVar -= 0.08;
      if (rotateVar <= -1) rotateDir = 0;
    }
    p5.rotate(p5.PI / 12 * rotateVar);
    p5.text('Rotate Device', 0, 0);
  }

  const GameOver = (p5) => {
    p5.fill(255);
    p5.textFont(font2);
    p5.textSize(3.8 * standardSize);
    p5.text(end_text, 2.5 * standardSize, -3 * standardSize);
    p5.image(chai, -12 * standardSize, -6 * standardSize, 12 * standardSize, 12 * standardSize);
    p5.textSize(2.5 * standardSize);
    p5.text("Score: " + score, 2 * standardSize, -0.5 * standardSize);
    p5.textSize(1.5 * standardSize);
    p5.text("Tap or Press Enter To restart", 2.7 * standardSize, 2.7 * standardSize);
    p5.textFont(font);
    p5.textSize(standardSize / 2);
    clearInterval(enemInterval);
  }

  const windowResized = p5 => {
    var vw, vh;
    if (11 * p5.windowHeight / 7 < p5.windowWidth) {
      standardSize = p5.windowHeight / 14;
    } else {
      standardSize = p5.windowWidth / 22;
    }
    vw = standardSize * 22;
    vh = standardSize * 14;
    gameState = "SS";
    p5.textSize(standardSize * 0.5);
    p5.resizeCanvas(vw, vh);
    CheckOrientaion(p5);
  };

  const Start_Resume = (p5) => {
    len = 0;
    p5.frameRate(60);
    gameState = "LevelSplash"
    setTimeout(() => {
      gameState = "game";
      enemInterval = setInterval(() => {
        moveEnemies(p5);
      }, 800 - levelNo * 100);
      setTimeout(() => { activateEnemies(p5) }, 3000);
    }, 1500);
  }

  const LevelSplash = (p5) => {
    p5.frameRate(60);
    p5.fill(255, 255, 20);
    p5.text(`Level ${levelNo}`, 0, -standardSize);
    p5.stroke(255, 140, 20);
    p5.strokeWeight(10);
    p5.line(-5 * standardSize, 1.5 * standardSize, -5 * standardSize + len, 1.5 * standardSize);
    p5.strokeWeight(0)
    len += standardSize / 9;
    if (p5.windowWidth < 900) { // Assuming all touch screens to be less than 900px in width
      p5.text('Swipe to change pacman direction', 0, 3 * standardSize);
    }
    p5.text('Get energised for next level threat by drinking all the coffee', 0, 5 * standardSize);
    if (p5.windowwidth < 600) {
      p5.text('Use in Landscape mode for best experience');
    }
  };

  const setHS = () => {
    if (localStorage.getItem('highscore') === null || localStorage.getItem('highscore') < score) {
      localStorage.setItem('highscore', score);
    }
  }

  const touchStarted = (p5) => {
    if (gameState === "SS") {
      Start_Resume(p5);
    } else if (gameState === "go") {
      setHS();
      gameState = "SS";
      score = 0;
      levelNo = 1;
      maze(p5);
    }
  }

  const touchMoved = (p5, event) => {
    if (!firedAgain) {
      if (p5.abs(p5.mouseX - p5.pmouseX) > p5.abs(p5.mouseY - p5.pmouseY) && p5.abs(p5.mouseX - p5.pmouseX) > 5) {
        if (p5.mouseX > p5.pmouseX)
          dir = 'RIGHT';
        else
          dir = 'LEFT';
      } else if (p5.abs(p5.mouseX - p5.pmouseX) < p5.abs(p5.mouseY - p5.pmouseY) && p5.abs(p5.mouseY - p5.pmouseY) > 5) {
        if (p5.mouseY > p5.pmouseY)
          dir = 'DOWN';
        else
          dir = 'UP';
      }
      firedAgain = true;
      setTimeout(() => { firedAgain = false }, 200);
    }
    return false;
  }

  const keyPressed = p5 => {
    if (p5.keyCode === p5.ENTER) {
      if (gameState === "SS") { Start_Resume(p5); }
      else if (gameState === "go") { setHS(); gameState = "SS"; score = 0; levelNo = 1; maze(p5); }
    } else {
      if (p5.keyCode === p5.LEFT_ARROW) {
        dir = 'LEFT';
      } else if (p5.keyCode === p5.RIGHT_ARROW) {
        dir = 'RIGHT';
      } else if (p5.keyCode === p5.UP_ARROW) {
        dir = 'UP';
      } else if (p5.keyCode === p5.DOWN_ARROW) {
        dir = 'DOWN';
      }
    }
  }

  const movePac = (p5, d) => {
    dir = d;
    var newx = pacman.x;
    var newy = pacman.y;
    if (d === 'LEFT' && pacman.x > -21 / 2) { pacman.mouth = 0; newx -= 1; }
    else if (d === 'RIGHT' && pacman.x < 21 / 2) { pacman.mouth = 1; newx += 1; }
    else if (d === 'UP' && pacman.y > -11 / 2) { newy -= 1; }
    else if (d === 'DOWN' && pacman.y < 12 / 2) { newy += 1; }
    if (newx !== pacman.x || newy !== pacman.y) {
      var flag = true;
      for (var i = 0; i < Blocks.length; i++) {
        var dis = distance(newx, newy, Blocks[i].x, Blocks[i].y);
        if (dis < 1) {
          flag = false;
        }
      }
      if (flag === true) {
        pacman.x = newx;
        pacman.y = newy;
        for (i = 0; i < Foods.length; i++) {
          dis = distance(newx, newy, Foods[i].x, Foods[i].y);
          if (dis < 1) {
            score += 1;
            Foods.splice(i, 1);
            i--;
          }
        }
        for (i = 0; i < Powers.length; i++) {
          dis = distance(newx, newy, Powers[i].x, Powers[i].y);
          if (dis < 1) {
            score += 5;
            pacman.power = true;
            Powers.splice(i, 1);
            i--;
          }
        }
        for (i = 0; i < Enemies.length; i++) {
          dis = distance(newx, newy, Enemies[i].x, Enemies[i].y);
          if (dis < 1) {
            HandleEnePacCollision(p5, i);
          }
        }
      }
    }
  };

  const activateEnemies = (p5) => {
    for (var i = 0; i < Enemies.length; i++) {
      if (Enemies[i].state === 0) {
        Enemies[i].x = Gates[p5.int(p5.random(0, 2))].x;
        Enemies[i].y = Gates[p5.int(p5.random(0, 2))].y;
        Enemies[i].state = 1;
      }
    }
  }

  const activateEnem = (p5, Enem) => {
    Enem.x = Gates[p5.int(p5.random(0, 2))].x;
    Enem.y = Gates[p5.int(p5.random(0, 2))].y;
    Enem.state = 1;
  }

  const HandleEnePacCollision = (p5, i) => {
    if (pacman.power) {
      Enemies[i].state = 0;
      Enemies[i].x = Enemies[i].init.x;
      Enemies[i].y = Enemies[i].init.y;
      score += 100;
      pacman.power = false;
      setTimeout(() => { activateEnem(p5, Enemies[i]) }, 15000);
    } else {
      gameState = "go";
      end_text = "Game Over";
    }
  }

  const moveEnemies = (p5) => {
    for (var i = 0; i < Enemies.length; i++) {
      var newx = Enemies[i].x;
      var newy = Enemies[i].y;
      let dir = p5.int(p5.random(0, 1000)) % 4;
      if (dir === 0) {
        if (newx > -21 / 2) newx -= 1;
      } else if (dir === 1) {
        if (newx < 21 / 2) newx += 1;
      } else if (dir === 2) {
        if (newy > -11 / 2) newy -= 1;
      } else if (dir === 3) {
        if (newy < 6) newy += 1;
      }

      var flag = true;
      for (var j = 0; j < Blocks.length; j++) {
        var dis = distance(newx, newy, Blocks[j].x, Blocks[j].y);
        if (dis < 1) {
          flag = false;
        }
      }
      for (j = 0; j < Enemies.length; j++) {
        dis = distance(newx, newy, Enemies[j].x, Enemies[j].y);
        if (dis < 1 && i !== j) {
          flag = false;
        }
      }
      if (flag === true) {
        Enemies[i].x = newx;
        Enemies[i].y = newy;
        dis = distance(newx, newy, pacman.x, pacman.y);
        if (dis < 1) {
          HandleEnePacCollision(p5, i);
        }
      }
    }
  }

  const maze = (p5) => {
    Blocks = [];
    Foods = [];
    Powers = [];
    Enemies = [];
    var fCount = 172;
    var pCount = 7;
    var addedPac = false;
    const level = [
      ['*', '*', '*', '*', '', '', '', '', '*', '*', '*', '*', '*', '*', '', '', '', '', '*', '*', '*', '*'],
      ['*', '', '', '', '', '', '', '', '', '', '*', '*', '', '', '', '', '', '', '', '', '', '*'],
      ['*', '', '*', '*', '', '', '', '*', '*', '', '*', '*', '', '*', '*', '', '', '', '*', '*', '', '*'],
      ['*', '', '*', '*', '', '', '', '', '', '*', '', '', '*', '', '', '', '', '', '*', '*', '', '*'],
      ['*', '', '*', '', '', '', '', '*', '*', '', '', '', '', '*', '*', '', '', '', '', '*', '', '*'],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '*', '*', '', '', '', '*', '', '', '*', '*', '*', '*', '', '', '*', '', '', '', '', '*', ''],
      ['', '', '', '', '', '', '*', '*', '*', '', '*', '*', '', '*', '*', '*', '', '', '', '', '', '*'],
      ['', '*', '*', '', '', '', '*', '', '', '', '', '', '', '', '', '*', '', '', '', '', '', '*'],
      ['*', '', '*', '', '', '', '*', '', '*', '*', '*', '*', '*', '*', '', '*', '', '', '', '', '', '*'],
      ['*', '', '*', '', '', '', '', 'eout', '*', 'e', '-', '-', '-', '*', 'eout', '', '', '', '*', '', '*', ''],
      ['', '', '', '', '', '', '*', '', '*', '*', '*', '*', '*', '*', '', '*', '', '', '', '', '', ''],
      ['', '*', '', '', '*', '', '*', '', '', '', '', '', '', '', '', '*', '', '', '*', '', '', '*']
    ]
    for (var i = 0; i < 13; i++) {
      for (var j = 0; j < 22; j++) {
        if (level[i][j] === '*') {
          Blocks.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
        }
        else if (level[i][j] === '') {
          let r = p5.int(p5.random(0, 20));
          if ((r === 1 || fCount === 0) && pCount > 0) {
            Powers.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
            pCount--;
          } else if (r === 2 && !addedPac) {
            pacman = { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2), mouth: 0, power: false }
            addedPac = true;
          } else if (fCount > 0) {
            Foods.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
            fCount--;
          }
        }
        else if (level[i][j] === 'e') {
          Enemies.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2), state: 0, init: { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) } });
          for (var k = 0; k < levelNo; k++) {
            j++;
            Enemies.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2), state: 0, init: { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) } });
          }
        }
        else if (level[i][j] === 'eout') {
          Gates.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
        }
      }
    }
  }

  const createMaze = p5 => {
    p5.fill(30, 20, 80)
    for (var i = 0; i < Blocks.length; i++) p5.square((Blocks[i].x - 1 / 2) * standardSize, (Blocks[i].y - 1 / 2) * standardSize, standardSize);
    for (i = 0; i < Foods.length; i++) p5.image(coffee, (Foods[i].x - 1 / 2) * standardSize, (Foods[i].y - 1 / 2) * standardSize, standardSize, standardSize);
    for (i = 0; i < Powers.length; i++) p5.image(chai, (Powers[i].x - 1 / 2) * standardSize, (Powers[i].y - 1 / 2) * standardSize, standardSize, standardSize);
    for (i = 0; i < Enemies.length; i++) p5.image((pacman.power && Enemies[i].state === 1) ? annaG : anna, (Enemies[i].x - 1 / 2) * standardSize, (Enemies[i].y - 1 / 2) * standardSize, 7 * standardSize / 8, 7 * standardSize / 8);
    p5.image(pacman.mouth === 1 ? pac1 : pac, (pacman.x - 0.5) * standardSize, (pacman.y - 0.5) * standardSize, standardSize, standardSize);
  }

  return (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Sketch preload={preload} setup={setup} draw={draw}
        windowResized={windowResized} keyPressed={keyPressed} touchStarted={touchStarted} touchMoved={touchMoved} />
    </div>
  );
}

export default App;
