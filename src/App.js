import React from 'react';
import Sketch from 'react-p5';

function App() {
  let font;
  let gameState = "SS";
  let score = 0;
  let open = 1.98;
  let sign = "add";
  let end_text = "GAME OVER";
  let pacman = { x: 20, y: 20, mouth: 0 }
  let standardSize = 40;
  let Blocks = [];
  let Foods = [];
  let Powers = [];
  let Enemies = [];

  const preload = p5 => {
    font = p5.loadFont("/fonts/Raleway-Regular.ttf");
  };
  const setup = (p5, canvasParentRef) => {
    var vw = 882;
    var vh = 562;
    if (vw > p5.windowWidth || vh > p5.windowHeight) {
      vw = p5.windowWidth; vh = p5.windowHeight;
      gameState = "Size"
    }
    p5.createCanvas(vw, vh, p5.WEBGL).parent(canvasParentRef);
    p5.textFont(font);
    p5.textAlign(p5.CENTER);
    p5.textSize(30);
    p5.fill(252);
    maze();
  };
  const draw = p5 => {
    p5.background(0)
    if (gameState === "Size") {
      p5.text("The game doesn't work on small screens", 0, 0)
    } else if (gameState === "SS") {
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
    p5.text('Score: ' + score, 0, -260);
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
    p5.text(end_text, 0, -20);
    p5.text("Score: " + score, 0, 20);
    p5.text("Press Enter To restart", 0, 240);
  }

  const windowResized = p5 => {
    var vw = 882;
    var vh = 562;
    if (vw > p5.windowWidth || vh > p5.windowHeight) {
      vw = p5.windowWidth; vh = p5.windowHeight;
      gameState = "Size"
    } else {
      gameState = "SS"
      score = 0
    }
    p5.resizeCanvas(vw, vh);
  };

  const keyPressed = p5 => {
    if (p5.keyCode === p5.ENTER) {
      if (gameState === "SS") { gameState = "game"; }
      else if (gameState === "go") { gameState = "SS"; score = 0; maze(); }
    } else if (gameState === "game") {
      var newx = pacman.x;
      var newy = pacman.y;
      if (p5.keyCode === p5.LEFT_ARROW) {
        pacman.mouth = p5.PI;
        if (pacman.x > -420) newx -= standardSize;
      } else if (p5.keyCode === p5.RIGHT_ARROW) {
        pacman.mouth = 0;
        if (pacman.x < 420) newx += standardSize;
      } else if (p5.keyCode === p5.UP_ARROW) {
        pacman.mouth = 3 * p5.HALF_PI;
        if (pacman.y > -220) newy -= standardSize;
      } else if (p5.keyCode === p5.DOWN_ARROW) {
        pacman.mouth = p5.HALF_PI;
        if (pacman.y < 260) newy += standardSize;
      }
      var flag = true;
      for (var i = 0; i < Blocks.length; i++) {
        var dis = p5.dist(newx, newy, Blocks[i].x, Blocks[i].y);
        if (dis === 0) {
          flag = false;
        }
      }
      if (flag === true) {
        pacman.x = newx;
        pacman.y = newy;
      }
      for (i = 0; i < Foods.length; i++) {
        dis = p5.dist(newx, newy, Foods[i].x, Foods[i].y);
        if (dis === 0) {
          score += 1;
          Foods.splice(i, 1);
          i--;
        }
      }
      for (i = 0; i < Powers.length; i++) {
        dis = p5.dist(newx, newy, Powers[i].x, Powers[i].y);
        if (dis === 0) {
          score += 5;
          Powers.splice(i, 1);
          i--;
        }
      }
    }
  };

  const maze = () => {
    const level = [
      ['*', '*', '*', '*', '-', '-', '-', '-', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '-', '-', '*'],
      ['*', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '*', '*', 'x', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['*', '-', '*', '*', '-', '*', '-', '*', '*', '-', '-', '*', '*', '-', '-', '*', '*', '-', '-', '*', '-', '*'],
      ['*', '-', '*', '*', '-', '-', '-', '*', '*', '-', 'p', '-', '-', '-', '-', '*', '*', '-', '-', '-', '-', '*'],
      ['-', '-', 'x', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['-', '-', '*', '*', '-', '-', '-', '*', '-', '-', '*', '*', '*', '*', '-', '-', '*', '-', '-', '-', '-', '*'],
      ['-', '-', '-', '-', '-', '-', '-', '*', '*', '*', '-', '*', '*', '-', '*', '*', '*', '-', '-', '-', '-', '-'],
      ['-', '*', '*', '*', '-', '-', '-', '*', 'x', '-', '-', 'eout', '-', '-', '-', '-', '*', '-', '-', '-', '-', '*'],
      ['*', '*', '', '*', '-', '-', '-', '*', '-', '*', '*', '*', '*', '*', '*', '-', '*', '-', '-', '-', '-', '*'],
      ['*', '*', '', '*', 'x', '*', '-', '-', '-', '*', 'e', 'e', 'e', '', '*', '-', '-', '-', '-', '*', '-', '*'],
      ['-', '*', '*', '*', '-', '-', '-', '-', '-', '*', '', '', '', '', '*', '-', 'x', '-', '-', '-', '-', '*'],
      ['-', '-', '-', '-', '-', '-', '-', '*', '-', '*', '*', '*', '*', '*', '*', '-', '*', '-', '-', '-', '-', '-'],
      ['-', '*', '*', '*', '-', '*', '-', '*', '-', '-', '-', '-', '-', '-', '-', '-', '*', '-', '-', '*', '-', '-']
    ]
    for (var i = 0; i < 13; i++) {
      for (var j = 0; j < 22; j++) {
        if (level[i][j] === '*') {
          Blocks.push({ x: (j - 11 + 1 / 2) * standardSize, y: (i - 6 + 1 / 2) * standardSize });
        }
        else if (level[i][j] === '-') {
          Foods.push({ x: (j - 11 + 1 / 2) * standardSize, y: (i - 6 + 1 / 2) * standardSize });
        }
        else if(level[i][j] === 'x') {
          Powers.push({ x: (j - 11 + 1 / 2) * standardSize, y: (i - 6 + 1 / 2) * standardSize });
        }
        else if (level[i][j] === 'p') {
          pacman = { x: (j - 11 + 1 / 2) * standardSize, y: (i - 6 + 1 / 2) * standardSize, mouth: 0 }
        } 
        else if (level[i][j] === 'e') {
          Enemies.push({ x: (j - 11 + 1 / 2) * standardSize, y: (i - 6 + 1 / 2) * standardSize});
        }
      }
    }
  }

  const createMaze = p5 => {
    p5.fill(255, 255, 0)
    p5.arc(pacman.x, pacman.y, standardSize, standardSize, pacman.mouth - open * p5.PI, pacman.mouth + open * p5.PI, p5.PIE);
    p5.fill(30, 20, 80)
    for (var i = 0; i < Blocks.length; i++) p5.square(Blocks[i].x - standardSize / 2, Blocks[i].y - standardSize / 2, 40);
    p5.fill(180, 180, 200)
    for (i = 0; i < Foods.length; i++) p5.ellipse(Foods[i].x, Foods[i].y, 10);
    p5.fill(0, 127, 255)
    for (i = 0; i < Powers.length; i++) p5.ellipse(Powers[i].x, Powers[i].y, 15);
    p5.fill(240, 20, 20)
    for (i = 0; i < Enemies.length; i++) p5.ellipse(Enemies[i].x, Enemies[i].y, 35);
  }

  return (
    <Sketch preload={preload} setup={setup} draw={draw}
      windowResized={windowResized} keyPressed={keyPressed} />
  );
}

export default App;
