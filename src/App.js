import React from 'react';
import Sketch from 'react-p5';

function App() {
  
  const setup = (p5, canvasParentRef) => {
    var vw = 882;
    var vh = 562;
    if(vw > p5.windowWidth || vh > p5.windowHeight){
      vw = p5.windowWidth; vh = p5.windowHeight;
    }
    p5.createCanvas(vw, vh, p5.WEBGL).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    p5.noLoop();
  };
  const draw = p5 => {
    p5.background(0)
    if(882 > p5.windowWidth || 562 > p5.windowHeight){
      console.log('Change orientation or Try on PC');
    }
  };
  
  const windowResized = p5 => {
    var vw = 882;
    var vh = 562;
    if(vw > p5.windowWidth || vh > p5.windowHeight){
      vw = p5.windowWidth; vh = p5.windowHeight;
    }
    p5.resizeCanvas(vw, vh);
  }

  return (
    <Sketch setup={setup} draw={draw}
      windowResized={windowResized} />
  );
}

export default App;
