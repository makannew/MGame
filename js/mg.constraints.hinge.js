
export function newHingeConstraint (mainComposite ,constraintName){
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
  constraintName.addFunction(hingeConstraint);
  constraintName.addFunction(setStatus);
  constraintName.addFunction(pivotA);
  constraintName.addFunction(pivotB);
  constraintName.addFunction(setMotor);
  constraintName.addFunction(setMotorSpeed);
}

function addToLoadedObjects({hingeConstraint}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(hingeConstraint);
  return true;
}

function addBodyA({bodyA}){
    proxiedComposite.addLink(bodyA.body , selfProxy.bodyABody);;
  return true;
}

function addBodyB({bodyB}){
  proxiedComposite.addLink(bodyB.body , selfProxy.bodyBBody);;
return true;
}

function pivotA({offsetA}){
    return new CANNON.Vec3(offsetA.x , offsetA.y , offsetA.z );
}

function pivotB({offsetB}){
  return new CANNON.Vec3(offsetB.x , offsetB.y , offsetB.z );
}

function hingeConstraint({bodyABody , bodyBBody , pivotA ,pivotB , maxForce , cannon}){
  if (hingeConstraint) return hingeConstraint;
  let newConstraint = new CANNON.HingeConstraint(bodyABody , bodyBBody , {pivotA:pivotA, pivotB:pivotB, maxForce:maxForce});
  if (axisA) newConstraint.axisA = axisA;
  if (axisB) newConstraint.axisB = axisB;
  return newConstraint;
}

function setStatus({active , hingeConstraint}){
    if (active && !setStatus){
      cannon.addConstraint(hingeConstraint);
      hingeConstraint.enable();
      ++bodyA.self.totalConstraints;
      ++bodyB.self.totalConstraints;
      return true;
    }
    if (!active && setStatus){
      hingeConstraint.disable();
      cannon.removeConstraint(hingeConstraint);
      --bodyA.self.totalConstraints;
      --bodyB.self.totalConstraints;
      return false;
    }
}

function setMotor({motor , hingeConstraint}){
  if (motor){
    hingeConstraint.enableMotor();
  }else{
    hingeConstraint.disableMotor();
  }
  return true;
}

function setMotorSpeed({speed , hingeConstraint}){
  hingeConstraint.setMotorSpeed(speed);
}
