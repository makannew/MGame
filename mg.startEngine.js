export function startEngine(gameInstance){
  let lastTime = 0;
  let animationFrameInterval=0;
  gameInstance.running = true;

  const mainloop = function (animationTimeStamp){
    if(animationTimeStamp>lastTime) {
      animationFrameInterval += (animationTimeStamp - lastTime) / 1000;
    }
    if (animationFrameInterval >= gameInstance.demandInterval){
      gameInstance.timeStamp = animationTimeStamp;
      gameInstance.actualInterval = animationFrameInterval;

      animationFrameInterval=0;
    }
    lastTime = animationTimeStamp;

    if (gameInstance.running) requestAnimationFrame(mainloop);
  }
  requestAnimationFrame(mainloop);
}