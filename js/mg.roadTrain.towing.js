
export function roadTrainTowing(roadTrain){

  roadTrain.frontTowing = {roadTrain};
  roadTrain.frontTowing.constraint = undefined;
  roadTrain.frontTowing.mainComposite =  roadTrain.mainComposite
  roadTrain.frontTowing.addFunction(linkChassisPosition);
  roadTrain.frontTowing.addFunction(setConstraint)

  roadTrain.frontTowing.loadedObjects = roadTrain.mainComposite.loadedObjects.getProxyLessObject;
  roadTrain.frontTowing.addFunction(addToLoadedObjects);
  roadTrain.frontTowing.addFunction(enableConstraint);



}

function addToLoadedObjects({setConstraint}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(setConstraint);
  return true;
}

function linkChassisPosition({towedRoadTrain}){
  roadTrain.addLink(towedRoadTrain.chassis.body , roadTrain.frontTowing.otherBody);
  roadTrain.addLink(roadTrain.chassis.body , roadTrain.frontTowing.thisBody);
  roadTrain.addLink(roadTrain.enable , roadTrain.frontTowing.thisEnable);
  roadTrain.addLink(towedRoadTrain.enable , roadTrain.frontTowing.otherEnable);




}

function setConstraint({thisTowingPosition,otherTowingPosition,thisBody ,otherBody}){
  if (setConstraint) return setConstraint
  let thisPos = new CANNON.Vec3(thisTowingPosition.x,thisTowingPosition.y,thisTowingPosition.z);
  let otherPos = new CANNON.Vec3(otherTowingPosition.x,otherTowingPosition.y,otherTowingPosition.z);

  constraint = new CANNON.PointToPointConstraint(thisBody,thisPos,otherBody,otherPos );
  return constraint;
}

function enableConstraint({setConstraint,thisEnable,otherEnable}){
  if (setConstraint && thisEnable && otherEnable && !enableConstraint){
    roadTrain.cannon.addConstraint(setConstraint);
    return true;
  }else{
    if (enableConstraint) roadTrain.cannon.removeConstraint(setConstraint);
    return false;

  }

}