import React from 'react';
import Sketch from 'react-p5';

function App() {
  
  const setup = (p5, canvasParentRef) => {
    var vw =  p5.windowWidth;
    var vh = p5.windowHeight;
    vw * 0.56 < vh ? vh = vw * 0.56 : vw = vh * 1.77;
    p5.createCanvas(vw, vh).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    p5.noLoop();
  };
  const draw = p5 => {
    p5.background(0)
  };
  
  const windowResized = p5 => {
    var vw =  p5.windowWidth;
    var vh = p5.windowHeight;
    vw * 0.56 < vh ? vh = vw * 0.56 : vw = vh * 1.77;
    p5.resizeCanvas(vw, vh);
  }

  return (
    <Sketch setup={setup} draw={draw}
      windowResized={windowResized} />
  );
}

export default App;
