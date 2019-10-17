import { roadTrainControls } from "./mg.roadTrain.controls.js";
import { loadBuilder } from "./mg.roadTrain.builder.js";
import { roadTrainTowing } from "./mg.roadTrain.towing.js";

export function newRoadTrain(mainComposite , roadTrain){
  roadTrain.loadedObjects = mainComposite.loadedObjects.getProxyLessObject;
  roadTrain.addFunction(addToLoadedObjects);

  roadTrain.self = roadTrain;
  roadTrain.mainComposite = mainComposite;
  roadTrain.cannon = mainComposite.cannon;
  mainComposite.addLink(mainComposite.actualInterval , roadTrain.actualInterval);

  roadTrainControls(roadTrain);
  roadTrainTowing(roadTrain);
  loadBuilder(roadTrain);

  roadTrain.allWheels = [];
  roadTrain.axelSprings = [];

  if (!roadTrain.enable) roadTrain.enable = false;
  if (!roadTrain.suspensionRestLenght) roadTrain.suspensionRestLenght = 0;
  if (!roadTrain.speed) roadTrain.speed = 0;
  if (!roadTrain.engineForce) roadTrain.engineForce = 30;
  roadTrain.addFunction(setHingeConstraints);
  roadTrain.addFunction(applySteering);
  roadTrain.addFunction(updateEngine);
  roadTrain.addFunction(roadtrainStatus);
  roadTrain.addFunction(setPosition);
  roadTrain.addFunction(resetLocation);

  
}

function addToLoadedObjects({setHingeConstraints}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(self);
  return true;
}

function resetLocation({resetPos,resetQuat}){
  let chassisLocalPos = new THREE.Vector3(0,-axelsVerticalFreedom,0);
  chassisLocalPos.applyQuaternion(resetQuat);
  self.chassis.set({position:chassisLocalPos.add(resetPos) , quaternion:resetQuat , reset:true});

  for (let i=0,len=allWheels.length;i<len;++i){
    let threeQuat = resetQuat.clone();
    let localPos = new THREE.Vector3(wheels[i].localPos.x,wheels[i].localPos.y,wheels[i].localPos.z);
    let correctionQuat =  new THREE.Quaternion(wheels[i].correctionQuat.x,wheels[i].correctionQuat.y,wheels[i].correctionQuat.z,wheels[i].correctionQuat.w);
    localPos.applyQuaternion(threeQuat);
    localPos.add(resetPos);
    threeQuat.multiply(correctionQuat);
    wheels[i].self.set({position:localPos,quaternion:threeQuat , reset:true});
    //
    let localSusPos = new THREE.Vector3(suspensions[i].localSusPos.x,suspensions[i].localSusPos.y,suspensions[i].localSusPos.z);
    threeQuat = resetQuat.clone();
    localSusPos.applyQuaternion(threeQuat);
    localSusPos.add(resetPos);
    suspensions[i].self.set({position:localSusPos,quaternion:threeQuat , reset:true});
  }
  resetPos = undefined;
  resetQuat = undefined;
}
function setPosition({newPos,newQuat,setHingeConstraints , setNewPos}){
  if (enable) return false;
  let chassisLocalPos = new THREE.Vector3(0,-axelsVerticalFreedom,0);
  chassisLocalPos.applyQuaternion( new THREE.Quaternion(newQuat.x,newQuat.y,newQuat.z,newQuat.w));
  chassisBody.position = new CANNON.Vec3(chassisLocalPos.x+ newPos.x,chassisLocalPos.y+newPos.y,chassisLocalPos.z+newPos.z);
  chassisBody.quaternion = new CANNON.Quaternion(newQuat.x,newQuat.y,newQuat.z,newQuat.w);

  for (let i=0,len=allWheels.length;i<len;++i){
    let threeQuat = new THREE.Quaternion(newQuat.x,newQuat.y,newQuat.z,newQuat.w)
    let localPos = new THREE.Vector3(wheels[i].localPos.x,wheels[i].localPos.y,wheels[i].localPos.z);
    let correctionQuat =  new THREE.Quaternion(wheels[i].correctionQuat.x,wheels[i].correctionQuat.y,wheels[i].correctionQuat.z,wheels[i].correctionQuat.w);
    localPos.applyQuaternion(threeQuat);
    localPos.add(newPos);
    threeQuat.multiply(correctionQuat);
    wheels[i].body.position = new CANNON.Vec3(localPos.x,localPos.y,localPos.z);
    wheels[i].body.quaternion =new CANNON.Quaternion(threeQuat.x,threeQuat.y,threeQuat.z,threeQuat.w);
    //
    let localSusPos = new THREE.Vector3(suspensions[i].localSusPos.x,suspensions[i].localSusPos.y,suspensions[i].localSusPos.z);
    threeQuat = new THREE.Quaternion(newQuat.x,newQuat.y,newQuat.z,newQuat.w);
    localSusPos.applyQuaternion(threeQuat);
    localSusPos.add(newPos);
    suspensions[i].body.position = new CANNON.Vec3(localSusPos.x,localSusPos.y,localSusPos.z);
    suspensions[i].body.quaternion =new CANNON.Quaternion(threeQuat.x,threeQuat.y,threeQuat.z,threeQuat.w);



    

  }
  enable=true;
}


function updateEngine({roadtrainStatus , engineForce , speed}){
  if (roadtrainStatus){
    for (let wheel of allWheels){
      if (wheel.driving){
        let c = wheel.wheelConstraint;
        if (engineForce==0){
          c.disableMotor()
        }else{
          c.setMotorMaxForce(engineForce);
          if (wheel.isLeft){
            c.setMotorSpeed(speed);
          }else{
            c.setMotorSpeed(-speed);
          }
          c.enableMotor();
        }
      }
  
    }
  }

}

function applySteering({steering , roadtrainStatus}){
  if (roadtrainStatus){
    let x = Math.cos(steering);
    let z = Math.sin(steering);
    for (let wheel of allWheels){
      if (wheel.steering){
        if (wheel.isLeft){
          wheel.wheelConstraint.axisA.x = x;
          wheel.wheelConstraint.axisA.z = z;
        }else{
          wheel.wheelConstraint.axisA.x = -x;
          wheel.wheelConstraint.axisA.z = -z;
        }
        wheel.wheelConstraint.update();
      }
    }
  }

}

function roadtrainStatus({setHingeConstraints , enable}){
  if (enable && roadtrainStatus) return true;
  if (!enable && !roadtrainStatus) return false;
  if (enable && !roadtrainStatus){
    for (let i=0,len=allWheels.length;i<len;++i){
      self.wheels[i].set({visible:true,physicStatus:true,sleep:false,enableCollisionCallback:true});
      self.suspensions[i].set({visible:true,physicStatus:true,sleep:false,enableCollisionCallback:true});
      cannon.addConstraint(allWheels[i].wheelConstraint);
      cannon.addConstraint(allWheels[i].suspensionConstraint);
      allWheels[i].wheelConstraint.rotationalEquation1.setSpookParams(1e10,4,1/120);
      allWheels[i].wheelConstraint.rotationalEquation2.setSpookParams(1e10,4,1/120);
      allWheels[i].suspensionConstraint.rotationalEquation1.setSpookParams(1e10,4,1/120);
      allWheels[i].suspensionConstraint.rotationalEquation2.setSpookParams(1e10,4,1/120);
    }
    self.chassis.set({visible:true,physicStatus:true,sleep:false,enableCollisionCallback:true});
    return true;
  }
  if (!enable && roadtrainStatus){
    for (let i=0,len=allWheels.length;i<len;++i){
      self.wheels[i].set({visible:false,physicStatus:false,sleep:true,enableCollisionCallback:false});
      self.suspensions[i].set({visible:false,physicStatus:false,sleep:true,enableCollisionCallback:false});
      cannon.removeConstraint(allWheels[i].wheelConstraint);
      cannon.removeConstraint(allWheels[i].suspensionConstraint);
    }
    self.chassis.set({visible:false,physicStatus:false,sleep:true,enableCollisionCallback:false});
    return false;
  }

}
function setHingeConstraints({headBodiesLoaded , cannon}){
  if (setHingeConstraints) return true;
  let zero = new CANNON.Vec3(0,0,0);
  let axisA,axisB;
  let backQuat = new THREE.Quaternion(
    chassisBody.quaternion.x,
    chassisBody.quaternion.y,
    chassisBody.quaternion.z,
    chassisBody.quaternion.w).normalize().inverse();

  for (let i=0,len=wheelsBodies.length;i<len;++i){
    let thisWheel={};

    let wheelRelativePos = new THREE.Vector3(
      wheelsBodies[i].position.x - suspensionsBodies[i].position.x, 
      wheelsBodies[i].position.y - suspensionsBodies[i].position.y, 
      wheelsBodies[i].position.z - suspensionsBodies[i].position.z
      );
      wheelRelativePos.applyQuaternion(backQuat);

    if (wheels[i].wheelLeft){
      thisWheel.isLeft = true;
      axisA = new CANNON.Vec3(1,0,0);
      axisB = new CANNON.Vec3(0,1,0);
    }

    if (!wheels[i].wheelLeft){
      thisWheel.isLeft = false;
      axisA = new CANNON.Vec3(-1,0,0);
      axisB = new CANNON.Vec3(0,1,0);
    }

    thisWheel.wheelConstraint = new CANNON.HingeConstraint(
      suspensionsBodies[i],
      wheelsBodies[i],{
      pivotA: new CANNON.Vec3(wheelRelativePos.x,wheelRelativePos.y,wheelRelativePos.z),
      axisA:axisA,
      pivotB: zero,
      axisB: axisB,
      maxForce:1e6,
      collideConnected:false
    });
    thisWheel.wheelConstraint.collideConnected = false;

    if (wheels[i].wheelSteering){
      thisWheel.steering =true;
    }else{
      thisWheel.steering =false;

    }

    if (wheels[i].driving){
      thisWheel.driving = true;
    }else{
      thisWheel.driving = false;
    }

    let susLocal = new THREE.Vector3(
      suspensionsBodies[i].position.x - chassisBody.position.x,
      suspensionsBodies[i].position.y - chassisBody.position.y,
      suspensionsBodies[i].position.z - chassisBody.position.z
      );
    susLocal.applyQuaternion(backQuat);

    let farPivotSuspension = new THREE.Vector3(
      -axisA.x * wheels[i].susLength, 
      0, 
      0
      );
    let farPivotTranspose = new THREE.Vector3(farPivotSuspension.x,0,0);

    let farPivotChassis = new THREE.Vector3(
      farPivotTranspose.x+susLocal.x, 
      farPivotTranspose.y+susLocal.y, 
      farPivotTranspose.z+susLocal.z
        );

    thisWheel.suspensionConstraint = new CANNON.HingeConstraint(
      chassisBody, 
      suspensionsBodies[i],{
        pivotA: new CANNON.Vec3(farPivotChassis.x,farPivotChassis.y,farPivotChassis.z),
        axisA: new CANNON.Vec3(0,0,1),
        pivotB:  new CANNON.Vec3(farPivotSuspension.x,farPivotSuspension.y,farPivotSuspension.z),
        axisB: new CANNON.Vec3(0,0,1),
        maxForce:1e6
      }
    );

    let susRelPos = new THREE.Vector3(
      wheelsBodies[i].position.x - chassisBody.position.x, 
      wheelsBodies[i].position.y - chassisBody.position.y , 
      wheelsBodies[i].position.z - chassisBody.position.z);
    susRelPos.applyQuaternion(backQuat);
    susRelPos.y = susRelPos.y - wheels[i].springLenght;

    axelSprings.push(new CANNON.Spring(
      chassisBody,
      suspensionsBodies[i],{
        restLength:suspensionRestLenght,
        stiffness: wheels[i].stiffness,
        damping: wheels[i].damping,
        localAnchorA:new CANNON.Vec3(susRelPos.x,susRelPos.y,susRelPos.z),
        localAnchorB:wheelRelativePos
      }
    ));

    allWheels.push(thisWheel);
  }

  cannon.addEventListener("postStep",function(event){
    if (roadtrainStatus){
      for (let i=0,len=axelSprings.length;i<len;++i){
        axelSprings[i].applyForce();
      }
    }
  });


  return true;
}