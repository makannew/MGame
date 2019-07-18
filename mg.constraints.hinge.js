
export function newHingeConstraint (mainComposite ,constraintName){
  mainComposite.constraints[constraintName] = {};
  let obj = mainComposite.constraints[constraintName];
  mainComposite.addLink(mainComposite.cannon , obj.cannon);
  obj.active = true;
  obj.maxForce = 1e6;
  obj.bodyABody = undefined;
  obj.bodyBBody = undefined;
  obj.offsetA = {x:0,y:0,z:0};
  obj.offsetB = {x:0,y:0,z:0};
  obj.axisA = undefined;
  obj.axisB = undefined;
  obj.addFunction(addBodyA);
  obj.addFunction(addBodyB);
  obj.addFunction(hingeConstraint);
  obj.addFunction(setStatus);
  obj.addFunction(pivotA);
  obj.addFunction(pivotB);
  obj.addFunction(setMotor);
  obj.addFunction(setMotorSpeed);


}

function addBodyA({bodyA}){
    proxiedComposite.addLink(bodyA.body , proxiedComposite.constraints[currentAddress[currentAddress.length - 1]].bodyABody);;
  return true;
}

function addBodyB({bodyB}){
  proxiedComposite.addLink(bodyB.body , proxiedComposite.constraints[currentAddress[currentAddress.length - 1]].bodyBBody);;
return true;
}

function pivotA({offsetA}){
    return new CANNON.Vec3(offsetA.x , offsetA.y , offsetA.z );
}

function pivotB({offsetB}){
  return new CANNON.Vec3(offsetB.x , offsetB.y , offsetB.z );
}

function hingeConstraint({bodyABody , bodyBBody , pivotA ,pivotB , maxForce , cannon}){
  let newConstraint = new CANNON.HingeConstraint(bodyABody , bodyBBody , {pivotA:pivotA, pivotB:pivotB, maxForce:maxForce});
  if (axisA) newConstraint.axisA = axisA;
  if (axisB) newConstraint.axisB = axisB;

  if (hingeConstraint){
    hingeConstraint.disable()
  }
  cannon.addConstraint(newConstraint);
  return newConstraint;
}

function setStatus({active , hingeConstraint}){
    if (active){
      hingeConstraint.enable();
    }else{
      hingeConstraint.disable();
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
