
export function newPointsConstraint (mainComposite ,constraintName){
  constraintName.loadedObjects = mainComposite.loadedObjects.getProxyLessObject;
  constraintName.addFunction(addToLoadedObjects);
  constraintName.mainComposite = mainComposite;
  mainComposite.addLink(mainComposite.cannon , constraintName.cannon);
  constraintName.selfProxy = constraintName;
  constraintName.self = constraintName;
  constraintName.active = true;
  constraintName.maxForce = 1e6;
  constraintName.offsetA = {x:0,y:0,z:0};
  constraintName.offsetB = {x:0,y:0,z:0};
  constraintName.addFunction(addBodyA);
  constraintName.addFunction(addBodyB);
  constraintName.addFunction(pointConstraint);
  constraintName.addFunction(setStatus);
  constraintName.addFunction(pivotA);
  constraintName.addFunction(pivotB);
}

function addToLoadedObjects({pointConstraint}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(pointConstraint);
  return true;
}

function addBodyA({bodyA}){
  proxiedComposite.addLink(bodyA.body , selfProxy.bodyABody);
  return true;
}

function addBodyB({bodyB}){
  proxiedComposite.addLink(bodyB.body , selfProxy.bodyBBody);
  return true
}

function pivotA({offsetA}){
    return new CANNON.Vec3(offsetA.x , offsetA.y , offsetA.z );
}

function pivotB({offsetB}){
  return new CANNON.Vec3(offsetB.x , offsetB.y , offsetB.z );
}

function pointConstraint({bodyABody , bodyBBody , pivotA , pivotB , maxForce , cannon}){
  if (pointConstraint) return pointConstraint;
  let newConstraint = new CANNON.PointToPointConstraint(bodyABody , pivotA , bodyBBody , pivotB , maxForce);
  return newConstraint;
}

function setStatus({active , pointConstraint}){
  if (active && !setStatus){
    cannon.addConstraint(pointConstraint);
    pointConstraint.enable();
    ++bodyA.self.totalConstraints;
    ++bodyB.self.totalConstraints;
    return true;
  }
  if (!active && setStatus){
    pointConstraint.disable();
    cannon.removeConstraint(pointConstraint);
    --bodyA.self.totalConstraints;
    --bodyB.self.totalConstraints;
    return false;
  }
}
