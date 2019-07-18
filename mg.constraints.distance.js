
export function newDistanceConstraint (mainComposite ,constraintName){
  mainComposite.constraints[constraintName] = {};
  let obj = mainComposite.constraints[constraintName];
  mainComposite.addLink(mainComposite.cannon , obj.cannon);
  obj.active = true;
  obj.maxForce = 1e6;
  obj.bodyABody = undefined;
  obj.bodyBBody = undefined;
  obj.distance = undefined;
  obj.addFunction(addBodyA);
  obj.addFunction(addBodyB);
  obj.addFunction(distanceConstraint);
  obj.addFunction(setStatus);
}

function addBodyA({bodyA}){
    proxiedComposite.addLink(bodyA.body , proxiedComposite.constraints[currentAddress[currentAddress.length - 1]].bodyABody);;
  return true;
}

function addBodyB({bodyB}){
  proxiedComposite.addLink(bodyB.body , proxiedComposite.constraints[currentAddress[currentAddress.length - 1]].bodyBBody);;
return true;
}

function distanceConstraint({bodyABody , bodyBBody , maxForce , cannon}){
  let newConstraint = new CANNON.DistanceConstraint(bodyABody , bodyBBody);
  if (distance) newConstraint.distance = distance;
  newConstraint.maxForce = maxForce;
  if (distanceConstraint){
    distanceConstraint.disable()
  }
  cannon.addConstraint(newConstraint);
  return newConstraint;
}

function setStatus({active , distanceConstraint}){
    if (active){
      distanceConstraint.enable();
    }else{
      distanceConstraint.disable();
    }
}
