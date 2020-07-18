import React from 'react';
import Sketch from 'react-p5';

function App() {
  let font;
  let gameState = "SS";
  let score = 0;

  let pacman = {x: 20, y: 20}
  let standardSize = 40;

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
    p5.textSize(36);
    p5.fill(252);
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
    // p5.text("GAME SCREEN", 0, 0)
    console.log(pacman.x, pacman.y)
    p5.ellipse(pacman.x, pacman.y, standardSize, standardSize)
  };

  const GameOver = (p5) => {
    p5.text("GAME OVER", 0, -20);
    p5.text("Score: "+score, 0 , 20);
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
    if(p5.keyCode === p5.ENTER) {
      if(gameState === "SS"){gameState = "game";}
      else if(gameState === "go") {gameState = "SS";score = 0;}
    } else if(gameState === "game") {
      if(p5.keyCode === p5.LEFT_ARROW) {
        if(pacman.x > -420) pacman.x -= standardSize;
      } else if(p5.keyCode === p5.RIGHT_ARROW) {
        if(pacman.x < 420) pacman.x += standardSize;
      } else if(p5.keyCode === p5.UP_ARROW) {
        if(pacman.y > -260) pacman.y -= standardSize;
      } else if(p5.keyCode === p5.DOWN_ARROW) {
        if(pacman.y < 260) pacman.y += standardSize;
      }
    }
  };

  return (
    <Sketch preload={preload} setup={setup} draw={draw}
      windowResized={windowResized} keyPressed={keyPressed} />
  );
}

export default App;
