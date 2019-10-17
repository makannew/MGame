
export function newRigidVehicle(mainComposite , vehicleName){
  mainComposite.vehicles[vehicleName] = {};
  let obj = mainComposite.vehicles[vehicleName];
  mainComposite.addLink(mainComposite.cannon , obj.cannon);

  obj.linkedWheelsBodies = [];
  obj.angularDamping = 0.4;
  obj.position =undefined;
  obj.quaternion = undefined;
  obj.wheelForce = undefined;
  obj.wheelSpeed = undefined;
  obj.addFunction(addChassis);
  obj.addFunction(rigidVehicle);
  obj.addFunction(addWheels);
  obj.addFunction(addWheelToVehicle);
  obj.addFunction(addToWorld);
  obj.addFunction(setPosition);
  obj.addFunction(setQuaternion);
  obj.addFunction(setWheelForce);

}

function addChassis({chassis}){
    proxiedComposite.addLink(chassis[0].body , proxiedComposite.vehicles[currentAddress[currentAddress.length - 1]].chassisBody);;
  return true;
}

function setWheelForce({wheelForce , addToWorld,wheelSpeed }){
  for(let i=0; i<wheels.length; i++){
    if (wheels[i].engine){
      if (wheels[i].leftHand){
        // rigidVehicle.applyWheelForce(-1*wheelForce,i);
        // rigidVehicle.setMotorSpeed(-1*wheelSpeed,i);

        rigidVehicle.constraints[i].enableMotor();
        rigidVehicle.constraints[i].setMotorMaxForce(wheelForce);
        rigidVehicle.constraints[i].setMotorSpeed(wheelSpeed);


      }else{
        rigidVehicle.constraints[i].enableMotor();
        rigidVehicle.constraints[i].setMotorMaxForce(-1*wheelForce);
        rigidVehicle.constraints[i].setMotorSpeed(-1*wheelSpeed);

        //rigidVehicle.applyWheelForce(-1*wheelForce,i);
        //rigidVehicle.setMotorSpeed(-1*wheelSpeed,i);

      }
      //rigidVehicle.setWheelForce(wheelForce,i);
      //rigidVehicle.constraints[i].setMotorSpeed(wheelSpeed);

      //rigidVehicle.constraints[i].enableMotor();
      //rigidVehicle.disableMotor(wheelSpeed,i);

    }
    if (wheels[i].steering){
      if (wheels[i].leftHand){
        rigidVehicle.setSteeringValue(Math.PI/16,i)
      }else{
        rigidVehicle.setSteeringValue(Math.PI/16,i)

      }
    }
    
  }
  return true;
}


function rigidVehicle({chassisBody}){
  if (chassis.compoundPosition){
    position = new CANNON.Vec3(chassis.compoundPosition.x,chassis.compoundPosition.y,chassis.compoundPosition.z);
  }else{
    position = new CANNON.Vec3(chassisBody.position.x,chassisBody.position.y,chassisBody.position.z);
  }
  return new CANNON.RigidVehicle({chassisBody: chassisBody});
}

function setPosition({rigidVehicle,position}){
  rigidVehicle.position = new CANNON.Vec3(position.x,position.y,position.z);
}

function setQuaternion({rigidVehicle,quaternion}){
  rigidVehicle.chassisBody.quaternion= new CANNON.Quaternion(quaternion.x,quaternion.y,quaternion.z,quaternion.w);

}

function addWheels({wheels}){
  for (let wheel of wheels){
    linkedWheelsBodies.push(undefined);
    proxiedComposite.addLink(wheel.body.body, proxiedComposite.vehicles[currentAddress[currentAddress.length - 1]].linkedWheelsBodies[linkedWheelsBodies.length-1]);
  }
  return true;
}

function addWheelToVehicle({rigidVehicle,linkedWheelsBodies}){
  for (let wheel of linkedWheelsBodies){
    if (!wheel) return undefined;
  }

  for (let i=0,len=linkedWheelsBodies.length;i<len;++i){
    let wheel = linkedWheelsBodies[i]
    let localPosition = new CANNON.Vec3(wheel.position.x - position.x, wheel.position.y - position.y, wheel.position.z - position.z);
    rigidVehicle.addWheel({
      body:wheel,
      position:localPosition,
      quaternion:wheel.quaternion,
      isFrontWheel:wheels[i].steering,
      frictionSlip:5,
      axis:wheels[i].axis,
      direction:wheels[i].direction
    })
  }

  for(let i=0; i<rigidVehicle.wheelBodies.length; i++){
    rigidVehicle.wheelBodies[i].angularDamping = 0.4;
  }

  return true;
}

function addToWorld({addWheelToVehicle , cannon}){
  rigidVehicle.addToWorld(cannon);
  return true;
}



