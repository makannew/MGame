export function newRayCastVehicle(mainComposite , vehicleName){
  mainComposite.vehicles[vehicleName] = {};
  let obj = mainComposite.vehicles[vehicleName];
  mainComposite.addLink(mainComposite.cannon , obj.cannon);
  mainComposite.addLink(mainComposite.timeStamp , obj.timeStamp);


  obj.linkedWheelsBodies = [];
  obj.angularDamping = 0.4;
  obj.position =undefined;
  obj.quaternion = undefined;
  // obj.wheelForce = undefined;
  // obj.steering = undefined;
  obj.wheelOptions = {
		radius: 9,
		directionLocal: new CANNON.Vec3(0, -1, 0), 
		suspensionStiffness: 43,
		suspensionRestLength: 0.18,
		frictionSlip: 10000,
		dampingRelaxation:1,
		dampingCompression: 1,
		maxSuspensionForce: 10000,
		rollInfluence: 0,
		axleLocal: new CANNON.Vec3(-1, 0, 0),
		chassisConnectionPointLocal: new CANNON.Vec3(1, 0, 1),
		maxSuspensionTravel:10,// 1,
		customSlidingRotationalSpeed: 30,
		useCustomSlidingRotationalSpeed: true
	};
  obj.addFunction(addChassis);
  obj.addFunction(raycastVehicle);
  obj.addFunction(addWheels);
  obj.addFunction(addWheelToVehicle);
  obj.addFunction(addToWorld);
  obj.addFunction(setPosition);
  obj.addFunction(setQuaternion);
  //obj.addFunction(setWheelForce);
  //obj.addFunction(setSteering);
  obj.addFunction(updateWheels);
  obj.addFunction(updateDriving);

}
function updateDriving({wheels ,addToWorld}){
  for(let i=0; i<wheels.length; i++){
      raycastVehicle.applyEngineForce(wheels[i].engine,i);
      raycastVehicle.setSteeringValue(wheels[i].steering,i)
      raycastVehicle.setBrake(wheels[i].brake,i)
  }
  return true;
  
}
function addChassis({chassis}){
    proxiedComposite.addLink(chassis[0].body , proxiedComposite.vehicles[currentAddress[currentAddress.length - 1]].chassisBody);;
  return true;
}

function updateWheels({timeStamp , addWheelToVehicle}){
  let quat = new CANNON.Quaternion();
  quat.setFromAxisAngle(new CANNON.Vec3(0,0,1).normalize(),Math.PI/2);
  for (let i = 0; i < raycastVehicle.wheelInfos.length; i++) {
    raycastVehicle.updateWheelTransform(i);
    let t = raycastVehicle.wheelInfos[i].worldTransform;
    linkedWheelsBodies[i].position.copy(t.position);
    linkedWheelsBodies[i].quaternion = t.quaternion.mult(quat)
  }
}

// function setWheelForce({wheelForce , addToWorld}){
//   for(let i=0; i<wheels.length; i++){
//     if (wheels[i].engine){
//       raycastVehicle.applyEngineForce(wheelForce,i);
//     }
//   }
//   return true;
// }

// function setSteering({steering , addToWorld}){
//   for(let i=0; i<wheels.length; i++){
//     if (wheels[i].steering){
//         raycastVehicle.setSteeringValue(steering,i)
//     }
//   }
//   return true;
// }

function raycastVehicle({chassisBody}){
  if (chassis.compoundPosition){
    position = new CANNON.Vec3(chassis.compoundPosition.x,chassis.compoundPosition.y,chassis.compoundPosition.z);
  }else{
    position = new CANNON.Vec3(chassisBody.position.x,chassisBody.position.y,chassisBody.position.z);
  }
  return new CANNON.RaycastVehicle({chassisBody: chassisBody , indexForwardAxis: 2,indexRightAxis: 0,indexUpAxis: 1});
}

function setPosition({raycastVehicle,position}){
  raycastVehicle.position = new CANNON.Vec3(position.x,position.y,position.z);
}

function setQuaternion({raycastVehicle,quaternion}){
  console.log("set quat")
  raycastVehicle.chassisBody.quaternion= new CANNON.Quaternion(quaternion.x,quaternion.y,quaternion.z,quaternion.w);

}

function addWheels({wheels}){
  if (addWheels) return true;
  addWheels =true;
  for (let wheel of wheels){
    linkedWheelsBodies.push(undefined);
    proxiedComposite.addLink(wheel.body.body, proxiedComposite.vehicles[currentAddress[currentAddress.length - 1]].linkedWheelsBodies[linkedWheelsBodies.length-1]);
  }
  return true;
}

function addWheelToVehicle({raycastVehicle,linkedWheelsBodies}){
  if (addWheelToVehicle) return true;
  for (let wheel of linkedWheelsBodies){
    if (!wheel) return undefined;
  }

  for (let i=0,len=linkedWheelsBodies.length;i<len;++i){
    let wheel = linkedWheelsBodies[i];
    wheelOptions.chassisConnectionPointLocal = new CANNON.Vec3(wheel.position.x - position.x, wheel.position.y - position.y, wheel.position.z - position.z);
    wheelOptions.radius = wheels[i].body.dimension.radiusTop;

    //wheelOptions.radius = wheels[i].body.dimension.radiusTop;
    // if (wheels[i].steering){
    //   wheelOptions.isFrontWheel = true;
    // }else{
    //   wheelOptions.isFrontWheel = false;
    // }
    raycastVehicle.addWheel(wheelOptions);
  }
  return true;
}

function addToWorld({addWheelToVehicle , cannon}){
  raycastVehicle.addToWorld(cannon);
  return true;
}



