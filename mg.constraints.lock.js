
export function newLockConstraint (mainComposite ,constraintName){
  mainComposite.constraints[constraintName] = {};
  let obj = mainComposite.constraints[constraintName];
  mainComposite.addLink(mainComposite.cannon , obj.cannon);
  obj.constraints = [];
  obj.linkedBodies = [];
  obj.addedIndex = 0;
  obj.active = true;
  obj.maxForce = 1e6;
  obj.addFunction(addBodies);
  obj.addFunction(addLockConstraint);
  obj.addFunction(setStatus);
}

function addBodies({bodies}){
  for (let body of bodies){
    linkedBodies.push(undefined);
    proxiedComposite.addLink(body.body , proxiedComposite.constraints[currentAddress[currentAddress.length - 1]].linkedBodies[linkedBodies.length-1]);;
  }
  return true;
}

function addLockConstraint({linkedBodies}){
  let previous = undefined;
  for (let i=addedIndex;i<linkedBodies.length;++i){
    if (linkedBodies[i]){
      if (!previous){
        previous = linkedBodies[i];
      }else{
        constraints.push(new CANNON.LockConstraint(linkedBodies[i],previous , {maxForce:maxForce}));
        cannon.addConstraint(constraints[constraints.length - 1]);
        previous = linkedBodies[i];
        addedIndex = i;
      }
    }else{
      break;
    }
  }
  return true;
}

function setStatus({active , addLockConstraint}){
  for (let constraint of constraints){
    if (active){
      constraint.enable();
    }else{
      constraint.disable();
    }
  }
}
