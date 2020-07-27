import React from 'react';
import Sketch from 'react-p5';

function App() {
  let font;
  let gameState = "SS";
  let score = 0;
  let open = 1.98;
  let sign = "add";
  let end_text = "GAME OVER";
  let pacman;
  let standardSize;
  let Blocks = [];
  let Foods = [];
  let Powers = [];
  let Enemies = [];
  let Gate;
  let firedtwice = false;

  const preload = p5 => {
    font = p5.loadFont("/fonts/Raleway-Regular.ttf");
  };
  const setup = (p5, canvasParentRef) => {
    var vw, vh;
    if (11 * p5.windowHeight / 7 < p5.windowWidth) {
      standardSize = p5.windowHeight / 14;
      vw = standardSize * 22;
      vh = standardSize * 14;
    } else {
      standardSize = p5.windowWidth / 22;
      vw = standardSize * 22;
      vh = standardSize * 14;
    }
    p5.createCanvas(vw, vh, p5.WEBGL).parent(canvasParentRef);
    p5.textFont(font);
    p5.textAlign(p5.CENTER);
    p5.textSize(standardSize * 0.5);
    p5.strokeWeight(0);
    p5.fill(252);
    maze(p5);
  };
  const draw = p5 => {
    p5.background(0)
    if (gameState === "SS") {
      StartScreen(p5);
    } else if (gameState === "game") {
      GameScreen(p5);
    } else if (gameState === "go") {
      GameOver(p5);
    }
  };

  const StartScreen = (p5) => {
    p5.text("PRESS ENTER TO START", 0, 0)
  };

  const GameScreen = (p5) => {
    p5.fill(255, 255, 255)
    p5.text('Score: ' + score, 0, -25 * standardSize / 4);
    if (sign === "add") {
      open += 0.01;
      if (open >= 1.95) sign = "sub";
    } else if (sign === "sub") {
      open -= 0.01;
      if (open <= 1.85) sign = "add";
    }
    createMaze(p5);
    if (Foods.length === 0) {
      gameState = "go";
      end_text = "YOU WIN";
    }
    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      p5.frameRate(6);
      movePac(p5, 'LEFT');
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      p5.frameRate(6);
      movePac(p5, 'RIGHT');
    } else if (p5.keyIsDown(p5.UP_ARROW)) {
      p5.frameRate(6);
      movePac(p5, 'UP');
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
      p5.frameRate(6);
      movePac(p5, 'DOWN');
    } else p5.frameRate(60);
  };

  const GameOver = (p5) => {
    p5.fill(255);
    p5.text(end_text, 0, -standardSize / 2);
    p5.text("Score: " + score, 0, standardSize / 2);
    p5.text("Press Enter To restart", 0, 6 * standardSize);
  }

  const windowResized = p5 => {
    var vw, vh;
    if (11 * p5.windowHeight / 7 < p5.windowWidth) {
      standardSize = p5.windowHeight / 14;
      vw = standardSize * 22;
      vh = standardSize * 14;
      gameState = "SS";
      p5.textSize(standardSize * 0.5);
    } else {
      standardSize = p5.windowWidth / 22;
      vw = standardSize * 22;
      vh = standardSize * 14;
      gameState = "SS";
      p5.textSize(standardSize * 0.5);
    }
    p5.resizeCanvas(vw, vh);
  };

  const Start_Resume = (p5) => {
    gameState = "game";
    setInterval(() => {
      moveEnemies(p5);
    }, 200);
    setTimeout(() => { activateEnemies() }, 5000);
  }

  const touchEnded = (p5) => {
    if (!firedtwice) {
      if (gameState === "SS") {
        Start_Resume(p5);
      } else if (gameState === "go") {
        gameState = "SS";
        score = 0;
        maze(p5);
      } else if (gameState === "game") {
        if (p5.windowWidth > p5.windowHeight) {
          if (p5.mouseX < p5.width / 6) {
            movePac(p5, 'LEFT');
          } else if (p5.mouseX > 5 * p5.width / 6) {
            movePac(p5, 'RIGHT');
          } else if (p5.mouseY < p5.height / 2) {
            movePac(p5, 'UP');
          } else {
            movePac(p5, 'DOWN');
          }
        } else {
          if (p5.mouseX < p5.width / 4) {
            movePac(p5, 'LEFT');
          } else if (p5.mouseX > 3 * p5.width / 4) {
            movePac(p5, 'RIGHT');
          } else if (p5.mouseY < p5.height / 2) {
            movePac(p5, 'UP');
          } else {
            movePac(p5, 'DOWN');
          }
        }
      }
      firedtwice = true;
      setTimeout(() => { firedtwice = false }, 100);
    }
  }

  const touchMoved = (p5) => {
    if(p5.abs(p5.mouseX - p5.pmouseX) > p5.abs(p5.mouseY - p5.pmouseY)) {
      if(p5.mouseX > p5.pmouseX)
        movePac(p5, 'RIGHT');
      else
        movePac(p5, 'LEFT');
    } else if(p5.abs(p5.mouseX - p5.pmouseX) < p5.abs(p5.mouseY - p5.pmouseY)) {
      if(p5.mouseY > p5.pmouseY)
        movePac(p5, 'DOWN');
      else
        movePac(p5, 'UP');
    }
  }

  const keyPressed = p5 => {
    if (p5.keyCode === p5.ENTER) {
      if (gameState === "SS") { Start_Resume(p5); }
      else if (gameState === "go") { gameState = "SS"; score = 0; maze(p5); }
    }
  }

  const movePac = (p5, dir) => {
    var newx = pacman.x;
    var newy = pacman.y;
    if(dir === 'LEFT' && pacman.x > -21 / 2) { pacman.mouth = p5.PI; newx -= 1; }
    else if (dir === 'RIGHT' && pacman.x < 21 / 2) { pacman.mouth = 0; newx += 1; }
    else if (dir === 'UP' && pacman.y > -11 / 2) { pacman.mouth = 3* p5.HALF_PI; newy -= 1; }
    else if (dir === 'DOWN' && pacman.y < 12 / 2) { pacman.mouth = p5.HALF_PI; newy += 1; }
    if( newx !== pacman.x || newy !== pacman.y) {
      var flag = true;
      for (var i = 0; i < Blocks.length; i++) {
        var dis = p5.dist(newx * standardSize, newy * standardSize, Blocks[i].x * standardSize, Blocks[i].y * standardSize);
        if (dis < 1) {
          flag = false;
        }
      }
      if (flag === true) {
        pacman.x = newx;
        pacman.y = newy;
      }
      for (i = 0; i < Foods.length; i++) {
        dis = p5.dist(newx * standardSize, newy * standardSize, Foods[i].x * standardSize, Foods[i].y * standardSize);
        if (dis < 1) {
          score += 1;
          Foods.splice(i, 1);
          i--;
        }
      }
      for (i = 0; i < Powers.length; i++) {
        dis = p5.dist(newx * standardSize, newy * standardSize, Powers[i].x * standardSize, Powers[i].y * standardSize);
        if (dis < 1) {
          score += 5;
          pacman.power = true;
          Powers.splice(i, 1);
          i--;
        }
      }
      for (i = 0; i < Enemies.length; i++) {
        dis = p5.dist(newx * standardSize, newy * standardSize, Enemies[i].x * standardSize, Enemies[i].y * standardSize);
        if (dis < 1) {
          if (pacman.power) {
            Enemies[i].state = 0;
            Enemies[i].x = Enemies[i].init.x;
            Enemies[i].y = Enemies[i].init.y;
            score += 100;
            pacman.power = false;
          } else {
            gameState = "go";
            end_text = "YOU LOSE";
          }
        }
      }
    }
  };

  const activateEnemies = () => {
    for (var i = 0; i < Enemies.length; i++) {
      if (Enemies[i].state === 0) {
        Enemies[i].x = Gate.x;
        Enemies[i].y = Gate.y;
        Enemies[i].state = 1;
      }
    }
  }

  const moveEnemies = (p5) => {
    for (var i = 0; i < Enemies.length; i++) {
      var newx = Enemies[i].x;
      var newy = Enemies[i].y;
      let dir = p5.int(p5.random(0, 4));
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
        var dis = p5.dist(newx * standardSize, newy * standardSize, Blocks[j].x * standardSize, Blocks[j].y * standardSize);
        if (dis < 1) {
          flag = false;
        }
      }
      for (j = 0; j < Enemies.length; j++) {
        dis = p5.dist(newx * standardSize, newy * standardSize, Enemies[j].x * standardSize, Enemies[j].y * standardSize);
        if (dis < 1 && i !== j) {
          flag = false;
        }
      }
      if (flag === true) {
        Enemies[i].x = newx;
        Enemies[i].y = newy;
      }
      dis = p5.dist(newx * standardSize, newy * standardSize, pacman.x * standardSize, pacman.y * standardSize);
      if (dis < 1) {
        if (pacman.power) {
          Enemies[i].state = 0;
          Enemies[i].x = Enemies[i].init.x;
          Enemies[i].y = Enemies[i].init.y;
          score += 100;
          pacman.power = false;
        } else {
          gameState = "go";
          end_text = "YOU LOSE";
        }
      }
    }
  }

  const maze = (p5) => {
    Blocks = [];
    Foods = [];
    Powers = [];
    Enemies = [];
    var fCount = 175;
    var pCount = 5;
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
      ['', '*', '*', '', '', '', '*', '', '', '', 'eout', '', '', '', '', '*', '', '', '', '', '', '*'],
      ['*', '', '*', '', '', '', '*', '', '*', '*', '*', '*', '*', '*', '', '*', '', '', '', '', '', '*'],
      ['*', '', '*', '', '', '', '', '', '*', 'e', 'e', 'e', 'e', '*', '', '', '', '', '*', '', '*', ''],
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
          } else {
            Foods.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
            fCount--;
          }
        }
        else if (level[i][j] === 'e') {
          Enemies.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2), state: 0, init: { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) } });
        }
        else {
          Gate = { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) };
        }
      }
    }
  }

  const createMaze = p5 => {
    pacman.power ? p5.fill(255, 140, 20) : p5.fill(255, 255, 20);
    p5.arc(pacman.x * standardSize, pacman.y * standardSize, standardSize, standardSize, pacman.mouth - open * p5.PI, pacman.mouth + open * p5.PI, p5.PIE);
    p5.fill(30, 20, 80)
    for (var i = 0; i < Blocks.length; i++) p5.square((Blocks[i].x - 1 / 2) * standardSize, (Blocks[i].y - 1 / 2) * standardSize, standardSize);
    p5.fill(180, 180, 200)
    for (i = 0; i < Foods.length; i++) p5.ellipse(Foods[i].x * standardSize, Foods[i].y * standardSize, standardSize / 4);
    p5.fill(0, 127, 255)
    for (i = 0; i < Powers.length; i++) p5.ellipse(Powers[i].x * standardSize, Powers[i].y * standardSize, 5 * standardSize / 8);
    pacman.power ? p5.fill(160) : p5.fill(240, 20, 20);
    for (i = 0; i < Enemies.length; i++) p5.ellipse(Enemies[i].x * standardSize, Enemies[i].y * standardSize, 7 * standardSize / 8);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Sketch preload={preload} setup={setup} draw={draw}
        windowResized={windowResized} keyPressed={keyPressed} touchStarted={touchEnded} touchMoved={touchMoved} />
    </div>
  );
}

export default App;
