
export function newLockConstraint (mainComposite ,constraintName){
  constraintName.loadedObjects = mainComposite.loadedObjects.getProxyLessObject;
  constraintName.mainComposite = mainComposite;
  mainComposite.addLink(mainComposite.cannon , constraintName.cannon);
  constraintName.selfProxy = constraintName;
  constraintName.self = constraintName;
  constraintName.constraints = [];
  constraintName.linkedBodies = [];
  constraintName.addedIndex = 0;
  constraintName.active = true;
  constraintName.maxForce = 1e6;
  constraintName.addFunction(addBodies);
  constraintName.addFunction(addLockConstraint);
  constraintName.addFunction(setStatus);
}

function addBodies({bodies}){
  for (let body of bodies){
    linkedBodies.push(undefined);
    proxiedComposite.addLink(body.body , selfProxy.linkedBodies[linkedBodies.length-1]);
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
        constraints.push(new CANNON.LockConstraint(linkedBodies[i] , previous , {maxForce:maxForce}));
        //cannon.addConstraint(constraints[constraints.length - 1]);
        mainComposite.loadedObjects.push(constraints[constraints.length - 1]);

        previous = linkedBodies[i];
        addedIndex = i;
      }
    }else{
      return undefined
    }
  }
  return true;
}

function setStatus({active , addLockConstraint}){
    if (active && !setStatus){
      for (let constraint of constraints){
        cannon.addConstraint(constraint);
        constraint.enable();
      }
      for (let body of bodies){
        ++body.self.totalConstraints;
      }
      return true;
    }
    if (!active && setStatus){
      for (let constraint of constraints){
        constraint.disable();
        cannon.removeConstraint(constraint);
      }
      for (let body of bodies){
        --body.self.totalConstraints;
      }
      return false;
    }
}
