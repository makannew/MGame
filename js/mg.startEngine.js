export async function startEngine(gameInstance){
  let lastTime = 0;
  let lastFrameTime;
  let frameNumber = 0;
  gameInstance.running = true;
  gameInstance.cannonSafeStep = .016;
  let cannonStep = gameInstance.cannonSafeStep;
  async function mainloop(t){
    if (gameInstance.running){
      let frameInterval = gameInstance.actualInterval;
      frameInterval += (t - lastTime) / 1000;
      lastTime = t;
      if (frameInterval >= cannonStep && gameInstance.compositeRunningFunctions==false){
        gameInstance.set({timeStamp:t, actualInterval:frameInterval,rendering:true ,framesInterval:t-lastFrameTime});
        lastFrameTime = t;
      }
    }
    requestAnimationFrame(mainloop);

  }
  function whileLoading(t){
    if (gameInstance.startUp) return;
    let frameInterval = gameInstance.actualInterval;
    if (frameNumber>24){
      let loaderElement = window.document.getElementById("myLoader");
      let loadingMessageElement = window.document.getElementById("loadingMessage");
      loaderElement.parentNode.removeChild(loaderElement);
      loadingMessageElement.parentNode.removeChild(loadingMessageElement);

      document.body.appendChild ( gameInstance.three.renderer.domElement.getProxyLessObject );
      gameInstance.startUp = t;
      requestAnimationFrame(mainloop);
    }
    if (frameInterval<cannonStep){
      if(lastTime==undefined) {
        frameInterval = cannonStep;
      }else{
        frameInterval += (t - lastTime) / 1000;
      }
      lastTime = t;
      //
      if (lastFrameTime==undefined) lastFrameTime = t;
      if (frameInterval >= cannonStep && gameInstance.compositeRunningFunctions==false){
        gameInstance.set({timeStamp:t, actualInterval:frameInterval,rendering:true ,framesInterval:t-lastFrameTime});
        lastFrameTime = t;
        ++frameNumber;
      }
    }
    requestAnimationFrame(whileLoading);
  }
  requestAnimationFrame(whileLoading);
}