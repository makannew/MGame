
export function newPointsConstraint (mainComposite ,constraintName){
  mainComposite.constraints[constraintName] = {};
  let obj = mainComposite.constraints[constraintName];
  mainComposite.addLink(mainComposite.cannon , obj.cannon);
  obj.active = true;
  obj.maxForce = 1e6;
  obj.bodyABody = undefined;
  obj.bodyBBody = undefined;
  obj.offsetA = {x:0,y:0,z:0};
  obj.offsetB = {x:0,y:0,z:0};
  obj.addFunction(addBodyA);
  obj.addFunction(addBodyB);
  obj.addFunction(pointConstraint);
  obj.addFunction(setStatus);
  obj.addFunction(pivotA);
  obj.addFunction(pivotB);

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

function pointConstraint({bodyABody , bodyBBody , pivotA , pivotB , maxForce , cannon}){
  let newConstraint = new CANNON.PointToPointConstraint(bodyABody , pivotA , bodyBBody , pivotB , maxForce);
  if (pointConstraint){
    pointConstraint.disable()
  }
  cannon.addConstraint(newConstraint);
  return newConstraint;
}

function setStatus({active , pointConstraint}){
    if (active){
      pointConstraint.enable();
    }else{
      pointConstraint.disable();
    }
}
