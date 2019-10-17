
export function roadTrainControls(roadTrain){
  roadTrain.turningSpeed = (Math.PI/6)/1.2; // rad per sec
  roadTrain.absMaxSteering = Math.PI/6;
  roadTrain.turningLeft = false;
  roadTrain.turningRight = false;
  roadTrain.drivingForward = true;
  roadTrain.steering = 0;
  roadTrain.touchSpan = 200;
  roadTrain.addFunction(setSteering);

}

function setSteering({turningLeft , turningRight ,actualInterval}){
  if (!turningRight && !turningLeft) return false;

  if (turningRight){
    let newSteering = steering + actualInterval * turningSpeed;
    if (newSteering>absMaxSteering){
      newSteering = absMaxSteering;
    }
    steering = newSteering;
  }

  if (turningLeft){
    let newSteering = steering - actualInterval * turningSpeed;
    if (newSteering<-absMaxSteering){
      newSteering = -absMaxSteering;
    }
    steering = newSteering;
  }
}