import React from 'react';
import Sketch from 'react-p5';

function App() {
  let font;
  let gameState = "game";
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
    p5.fill(252);
    maze();
  };
  const draw = p5 => {
    p5.background(0)
    if (gameState === "Portrait") {
      Rotate(p5);
    } else if (gameState === "SS") {
      StartScreen(p5);
    } else if (gameState === "game") {
      GameScreen(p5);
    } else if (gameState === "go") {
      GameOver(p5);
    }
  };

  const Rotate = (p5) => {
    console.log(p5.windowWidth, p5.windowHeight);
    p5.text("Try rotating the screen..", 0, 0);
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

  const touchStarted = p5 => {
    if (gameState === "SS") { 
      gameState = "game"; 
    } else if (gameState === "go") { 
      gameState = "SS"; 
      score = 0; 
      maze(); 
    } else if (gameState === "game") {
      var newx = pacman.x;
      var newy = pacman.y;
      if (p5.mouseX < p5.width / 4) {
        pacman.mouth = p5.PI;
        if (pacman.x > -21 / 2) newx -= 1;
      } else if (p5.mouseX > 3 * p5.width / 4) {
        pacman.mouth = 0;
        if (pacman.x < 21 / 2) newx += 1;
      } else if (p5.mouseY < p5.height / 2) {
        pacman.mouth = 3 * p5.HALF_PI;
        if (pacman.y > -11 / 2) newy -= 1;
      } else {
        pacman.mouth = p5.HALF_PI;
        if (pacman.y < 6) newy += 1;
      }
      movePac(p5, newx, newy);
    }
  }

  const keyPressed = p5 => {
    if (p5.keyCode === p5.ENTER) {
      if (gameState === "SS") { gameState = "game"; }
      else if (gameState === "go") { gameState = "SS"; score = 0; maze(); }
    } else if (gameState === "game") {
      var newx = pacman.x;
      var newy = pacman.y;
      if (p5.keyCode === p5.LEFT_ARROW) {
        pacman.mouth = p5.PI;
        if (pacman.x > -21 / 2) newx -= 1;
      } else if (p5.keyCode === p5.RIGHT_ARROW) {
        pacman.mouth = 0;
        if (pacman.x < 21 / 2) newx += 1;
      } else if (p5.keyCode === p5.UP_ARROW) {
        pacman.mouth = 3 * p5.HALF_PI;
        if (pacman.y > -11 / 2) newy -= 1;
      } else if (p5.keyCode === p5.DOWN_ARROW) {
        pacman.mouth = p5.HALF_PI;
        if (pacman.y < 6) newy += 1;
      }
      movePac(p5, newx, newy);
    }
  }

  const movePac = (p5, newx, newy) => {
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
        Powers.splice(i, 1);
        i--;
      }
    }

  };

  const maze = () => {
    const level = [
      ['*', '*', '*', '*', '-', '-', '-', '-', '*', '*', '*', '*', '*', '*', '-', '-', '-', '-', '*', '*', '*', '*'],
      ['*', '-', '-', '-', '-', '-', '-', '-', '-', '-', '*', '*', 'x', '-', '-', '-', '-', '-', '-', '-', '-', '*'],
      ['*', '-', '*', '*', '-', '-', '-', '*', '*', '-', '*', '*', '-', '*', '*', '-', '-', '-', '*', '*', '-', '*'],
      ['*', '-', '*', '*', '-', '-', '-', '-', '-', '*', '-', '-', '*', '-', 'x', '-', '-', '-', '*', '*', '-', '*'],
      ['*', '-', '*', '-', '-', '-', '-', '*', '*', '-', 'p', '-', '-', '*', '*', '-', '-', '-', '-', '*', '-', '*'],
      ['-', '-', 'x', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['-', '*', '*', '-', '-', '-', '*', '-', '-', '*', '*', '*', '*', '-', '-', '*', '-', '-', '-', '-', '*', '-'],
      ['-', '-', '-', '-', '-', '-', '*', '*', '*', '-', '*', '*', '-', '*', '*', '*', '-', '-', '-', '-', '-', '*'],
      ['-', '*', '*', '-', '-', '-', '*', 'x', '-', '-', 'eout', '-', '-', '-', '-', '*', '-', '-', '-', '-', '-', '*'],
      ['*', '-', '*', '-', '-', '-', '*', '-', '*', '*', '*', '*', '*', '*', '-', '*', '-', '-', '-', '-', '-', '*'],
      ['*', '-', '*', 'x', '*', '-', '-', '-', '*', 'e', 'e', 'e', 'e', '*', '-', '-', '-', '-', '*', '-', '*', '-'],
      ['-', '-', '-', '-', '-', '-', '*', '-', '*', '*', '*', '*', '*', '*', '-', '*', '-', '-', '-', '-', '-', '-'],
      ['-', '*', '*', '-', '*', '-', '*', '-', '-', '-', '-', '-', '-', '-', '-', '*', '-', '-', '*', '-', '-', '*']
    ]
    for (var i = 0; i < 13; i++) {
      for (var j = 0; j < 22; j++) {
        if (level[i][j] === '*') {
          Blocks.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
        }
        else if (level[i][j] === '-') {
          Foods.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
        }
        else if (level[i][j] === 'x') {
          Powers.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
        }
        else if (level[i][j] === 'p') {
          pacman = { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2), mouth: 0 }
        }
        else if (level[i][j] === 'e') {
          Enemies.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
        }
      }
    }
  }

  const createMaze = p5 => {
    p5.fill(255, 255, 0)
    p5.arc(pacman.x * standardSize, pacman.y * standardSize, standardSize, standardSize, pacman.mouth - open * p5.PI, pacman.mouth + open * p5.PI, p5.PIE);
    p5.fill(30, 20, 80)
    for (var i = 0; i < Blocks.length; i++) p5.square((Blocks[i].x - 1 / 2) * standardSize, (Blocks[i].y - 1 / 2) * standardSize, standardSize);
    p5.fill(180, 180, 200)
    for (i = 0; i < Foods.length; i++) p5.ellipse(Foods[i].x * standardSize, Foods[i].y * standardSize, standardSize / 4);
    p5.fill(0, 127, 255)
    for (i = 0; i < Powers.length; i++) p5.ellipse(Powers[i].x * standardSize, Powers[i].y * standardSize, 5 * standardSize / 8);
    p5.fill(240, 20, 20)
    for (i = 0; i < Enemies.length; i++) p5.ellipse(Enemies[i].x * standardSize, Enemies[i].y * standardSize, 7 * standardSize / 8);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Sketch preload={preload} setup={setup} draw={draw}
        windowResized={windowResized} keyPressed={keyPressed} touchStarted={touchStarted} />
    </div>
  );
}

export default App;
