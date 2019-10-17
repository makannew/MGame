
export function loadBuilder(roadTrain){
  roadTrain.wheels = undefined;
  roadTrain.wheelsBodies = undefined;
  roadTrain.suspensions = undefined;
  roadTrain.suspensionsBodies = undefined;
  roadTrain.cabinParts = undefined;

  roadTrain.gapRatio = .95;
  if (!roadTrain.position) roadTrain.position={x:0,y:0,z:0};
  if (!roadTrain.quaternion) roadTrain.quaternion={x:0,y:0,z:0,w:1};

  roadTrain.addFunction(buildRoadTrain)
  roadTrain.addFunction(headBodiesLoaded);
  roadTrain.addFunction(addBuilderToLoadedObjects);

}
function addBuilderToLoadedObjects({headBodiesLoaded,buildRoadTrain}){
  if (addBuilderToLoadedObjects) return true;
  mainComposite.loadedObjects.push(headBodiesLoaded);
  mainComposite.loadedObjects.push(buildRoadTrain);
  return true;
}

function headBodiesLoaded({wheelsBodies,suspensionsBodies,chassisBody}){
  if (headBodiesLoaded) return true;
  for (let body of wheelsBodies){
    if(!body) return undefined;
  }
  for (let body of suspensionsBodies){
    if(!body) return undefined;
  }
  
  return true;
}

function buildRoadTrain({wheelsInfo}){
  if (buildRoadTrain) return true;
  let roadTrain = self;
  wheels = [];
  wheelsBodies = [];
  suspensions = [];
  suspensionsBodies = [];
  cabinParts = [];
  gapRatio = .95;

  let x = position.x;
  let y = position.y;
  let z = position.z;

  let threeQuat = new THREE.Quaternion(quaternion.x,quaternion.y,quaternion.z,quaternion.w)

  let rotation
  let chassisFrontEst=0,chassisRearEst=0;
  let chassisWidthEst , maxChassisWidth;

  for (let wheelInfo of roadTrain.wheelsInfo){
    let wheels = roadTrain.wheels;

    // build wheels
    wheels.push({});
    let wheel = wheels[wheels.length - 1];
    let wheelOutPos = new THREE.Vector3(wheelInfo.doubleWheelGap/2 + (wheelInfo.width-wheelInfo.doubleWheelGap)/4 ,0 ,0);
    let wheelInPos = new THREE.Vector3(wheelInfo.doubleWheelGap/2 + (wheelInfo.width-wheelInfo.doubleWheelGap)/4 ,0 ,0);

    
    let wheelPos = new THREE.Vector3(wheelInfo.axelLength,wheelInfo.radius-wheelInfo.axelHeight,wheelInfo.distance)
    if (wheelInfo.left){
      rotation = Math.PI/2;
      wheelInPos.x = -wheelInPos.x;
    }else{
      wheelOutPos.x = -wheelOutPos.x;
      wheelPos.x = -wheelPos.x;
      rotation = -Math.PI/2;
    }
    wheel.localPos = new THREE.Vector3(wheelPos.x,wheelPos.y,wheelPos.z); // save local pos relative to chassis
    wheelPos.applyQuaternion(threeQuat);
    let correctionQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1).normalize(), rotation);
    wheel.correctionQuat = new THREE.Quaternion(correctionQuat.x,correctionQuat.y,correctionQuat.z,correctionQuat.w);
    let wheelQuat = new THREE.Quaternion(threeQuat.x,threeQuat.y,threeQuat.z,threeQuat.w)
    wheelQuat.multiply(correctionQuat);

    let wheelPhysicCompound =[];

    let radius = (wheelInfo.doubleWheelGap) ? wheelInfo.axelDiameter:wheelInfo.radius;
    mainComposite.utils.addObject(wheel);
    wheel.set({
      geometryName:"cylinder", 
      dimension:{radiusTop:radius,radiusBottom:radius,height:wheelInfo.width*.99}, 
      position:{x:x+wheelPos.x , y:y+wheelPos.y , z:z+wheelPos.z}, 
      color:wheelInfo.color, 
      quaternion:new THREE.Quaternion(wheelQuat.x,wheelQuat.y,wheelQuat.z,wheelQuat.w),
      materialName:"basic", 
      shinines:0,
      textureFileName:wheelInfo.textureFileName,
      materialIndex:[0,1,2],
      visible:false,
      sleep:true,
      groupName:"wheel",
      collisionGroups:["ground","obstacle"]
    });
    wheelPhysicCompound.push(wheel);
    if (wheelInfo.doubleWheelGap){
      wheelInPos.applyQuaternion(threeQuat);
      wheelOutPos.applyQuaternion(threeQuat);
      wheelInPos.add(wheel.position);
      wheelOutPos.add(wheel.position);
      wheel.wheelIn ={};
      mainComposite.utils.addObject(wheel.wheelIn);
      wheel.wheelIn.set({
        geometryName:"cylinder", 
        dimension:{radiusTop:wheelInfo.radius,radiusBottom:wheelInfo.radius,height:(wheelInfo.width - wheelInfo.doubleWheelGap)/2}, 
        position:{x:wheelInPos.x , y:wheelInPos.y , z:wheelInPos.z}, 
        color:wheelInfo.color, 
        quaternion:new THREE.Quaternion(wheelQuat.x,wheelQuat.y,wheelQuat.z,wheelQuat.w),
        materialName:"lambert", 
        shinines:0,
        textureFileName:wheelInfo.textureFileName,
        materialIndex:[0,1,2],
        visible:false,
        sleep:true
      });
      wheelPhysicCompound.push(wheel.wheelIn);
      wheel.wheelOut ={};
      mainComposite.utils.addObject(wheel.wheelOut);
      wheel.wheelOut.set({
        geometryName:"cylinder", 
        dimension:{radiusTop:wheelInfo.radius,radiusBottom:wheelInfo.radius,height:(wheelInfo.width - wheelInfo.doubleWheelGap)/2}, 
        position:{x:wheelOutPos.x , y:wheelOutPos.y , z:wheelOutPos.z}, 
        color:wheelInfo.color, 
        quaternion:new THREE.Quaternion(wheelQuat.x,wheelQuat.y,wheelQuat.z,wheelQuat.w),
        materialName:"lambert", 
        shinines:0,
        textureFileName:wheelInfo.textureFileName,
        materialIndex:[0,1,2],
        visible:false,
        sleep:true
      });
      wheelPhysicCompound.push(wheel.wheelOut);

    }


    let susLength = (wheelInfo.axelLength-wheelInfo.width/2) * roadTrain.gapRatio;

    //mainComposite.utils.addPhysicBody(wheel);
    mainComposite.utils.makePhysicCompound(wheelPhysicCompound);
    wheel.set({
      angularDamping:wheelInfo.angularDamping,
      linearDamping:0,
      physicMaterial:wheelInfo.wheelMaterial, 
      mass:wheelInfo.wheelMass, 
      wheelLeft:wheelInfo.left, 
      wheelSteering:wheelInfo.steering, 
      driving:wheelInfo.engine, 
      stiffness:wheelInfo.stiffness, 
      damping:wheelInfo.damping, 
      springLenght:wheelInfo.springLegth,
      allowSleep:false,
      susLength,
      physicStatus:false
    });
    // build suspension
    let suspensions = roadTrain.suspensions;
    let susPos = new THREE.Vector3(wheelInfo.axelLength - wheelInfo.width/2 - susLength/2,0,wheelInfo.distance);

    if (!wheelInfo.left){
      susPos.x*=-1;
    }

    
    suspensions.push({});
    let suspension = suspensions[suspensions.length - 1];
    suspension.localSusPos = new THREE.Vector3(susPos.x,susPos.y,susPos.z); // save local pos relative to chassis
    susPos.applyQuaternion(threeQuat);

    mainComposite.utils.addObject(suspension);
    suspension.set({
      geometryName:"box", 
      dimension:{ height:wheelInfo.axelDiameter , width: wheelInfo.axelDiameter , length:susLength }, 
      position:{x:x+susPos.x , y:y+susPos.y , z:z+susPos.z}, 
      quaternion:new THREE.Quaternion(threeQuat.x,threeQuat.y,threeQuat.z,threeQuat.w),
      color:wheelInfo.susColor, 
      materialName:"basic", 
      shinines:0,
      visible:false,
      sleep:true
    });
    mainComposite.utils.addPhysicBody(suspension);
    suspension.set({
      physicMaterial:wheelInfo.axelMaterial, 
      mass:wheelInfo.axelMass,
      allowSleep:false,
      physicStatus:false,
      groupName:"suspension",
      collisionGroups:["chassis"]
    });
    if (wheelInfo.distance+wheelInfo.axelDiameter*2>chassisFrontEst){
      chassisFrontEst = wheelInfo.distance+wheelInfo.axelDiameter*2;
    }
    if (wheelInfo.distance-wheelInfo.axelDiameter*2<chassisRearEst){
      chassisRearEst = wheelInfo.distance-wheelInfo.axelDiameter*2;
    }

    // chassis width auto calculation
      maxChassisWidth = (wheelInfo.axelLength-wheelInfo.radius)*2
    if (!chassisWidthEst || chassisWidthEst>maxChassisWidth){
      chassisWidthEst = maxChassisWidth;
    }
  }

  // set chassisWidth if not defined by user
  if (!roadTrain.chassisWidth){
    roadTrain.chassisWidth = chassisWidthEst;
    //console.log("with",roadTrain.chassisWidth)

  }
  // set chassisFrontLength if not defined by user
  if (!roadTrain.chassisFrontLength){
    roadTrain.chassisFrontLength = chassisFrontEst;
  }
  // set chassisRearLength if not defined by user
  if (!roadTrain.chassisRearLength){
    roadTrain.chassisRearLength = chassisRearEst;
  }

  let  massCenterChassisLength , extensionChassisLength , extensionChassisLocalZ;
  roadTrain.chassisLength = roadTrain.chassisFrontLength-roadTrain.chassisRearLength;
  if (Math.abs(chassisFrontLength)<Math.abs(chassisRearLength)){
    massCenterChassisLength = Math.abs(roadTrain.chassisFrontLength)*2;
    extensionChassisLocalZ = -roadTrain.chassisFrontLength + (roadTrain.chassisRearLength + roadTrain.chassisFrontLength)/2;
  }else{
    massCenterChassisLength = Math.abs(roadTrain.chassisRearLength)*2;
    extensionChassisLocalZ = -roadTrain.chassisRearLength + (roadTrain.chassisRearLength + roadTrain.chassisFrontLength)/2;
  }
  extensionChassisLength = roadTrain.chassisLength - massCenterChassisLength;
  // chassis
  roadTrain.chassisTop={};
  mainComposite.utils.addObject(roadTrain.chassisTop);
  let chassisTopPos = new THREE.Vector3(
    0,
    roadTrain.axelsVerticalFreedom,
    (roadTrain.chassisFrontLength+roadTrain.chassisRearLength)/2
    );
  chassisTopPos.applyQuaternion(threeQuat);

  roadTrain.chassisTop.set({
    geometryName : "box", 
    dimension : { height:roadTrain.chassisLength , width: roadTrain.chassisTickness , length: roadTrain.chassisWidth}, 
    position :{x:x+chassisTopPos.x , y:y+chassisTopPos.y , z:z+chassisTopPos.z}, 
    quaternion:new THREE.Quaternion(threeQuat.x,threeQuat.y,threeQuat.z,threeQuat.w),
    color : roadTrain.chassisColor, 
    textureFileName:["/textures/bed.png"],
    materialName:"lambert",
    visible:false,
    sleep:true
  });

  roadTrain.chassis={};
  mainComposite.utils.addObject(roadTrain.chassis);
  let chassisPos = new THREE.Vector3(
    0,
    -roadTrain.axelsVerticalFreedom,
    0
    );
  chassisPos.applyQuaternion(threeQuat);

  roadTrain.chassis.set({
    geometryName : "box" , 
    dimension : { height:massCenterChassisLength , width: roadTrain.chassisTickness , length:roadTrain.chassisWidth}, 
    position :{x:x+chassisPos.x , y:y+chassisPos.y , z:z+chassisPos.z}, 
    quaternion:new THREE.Quaternion(threeQuat.x,threeQuat.y,threeQuat.z,threeQuat.w),
    color : roadTrain.chassisColor, 
    textureFileName:["/textures/bed.png"],
    materialName:"lambert" ,
    visible:false,
    sleep:true,
    groupName:"chassis",
    collisionGroups:["suspension","obstacle","ground","chassis"],
    physicMaterial:"chassisMaterial"
  });


let compoundParts = [roadTrain.chassis,roadTrain.chassisTop];
if (extensionChassisLength!=0){
  roadTrain.chassisExtension={};
  mainComposite.utils.addObject(roadTrain.chassisExtension);
  let chassisExtensionPos = new THREE.Vector3(
    0,
    -roadTrain.axelsVerticalFreedom,
    extensionChassisLocalZ
    );
  chassisExtensionPos.applyQuaternion(threeQuat);

  roadTrain.chassisExtension.set({
    geometryName : "box" , 
    dimension : { height:extensionChassisLength , width: roadTrain.chassisTickness , length:roadTrain.chassisWidth}, 
    position :{x:x+chassisExtensionPos.x , y:y+chassisExtensionPos.y , z:z+chassisExtensionPos.z}, 
    quaternion:new THREE.Quaternion(threeQuat.x,threeQuat.y,threeQuat.z,threeQuat.w),
    color : roadTrain.chassisColor, 
    textureFileName:["/textures/bed.png"],
    materialName:"lambert",
    visible:false,
    sleep:true
  });
  compoundParts.push(roadTrain.chassisExtension)
}

if (roadTrain.cabinInfo){
  for (let cabin of cabinInfo){
    roadTrain.cabinParts.push(cabin)
    let cabinPart = roadTrain.cabinParts[roadTrain.cabinParts.length - 1];
    mainComposite.utils.addObject(cabinPart);
    let cabinLocalPos = new THREE.Vector3(cabin.localPosition.x,cabin.localPosition.y,cabin.localPosition.z);
    let cabinLocalQuat =  new THREE.Quaternion(cabin.localQuaternion.x,cabin.localQuaternion.y,cabin.localQuaternion.z,cabin.localQuaternion.w);
    cabinLocalPos.applyQuaternion(threeQuat);
    cabinLocalPos.add(new THREE.Vector3(x,y,z))
    cabinLocalQuat.multiply(threeQuat);
    cabinPart.set({position:cabinLocalPos,quaternion:cabinLocalQuat , visible:false,sleep:true});
    if (roadTrain.cabinPhysic){
      compoundParts.push(cabinPart);
    }else{
      mainComposite.addLink(roadTrain.position,cabinPart.chassisPos);
      mainComposite.addLink(roadTrain.quaternion,cabinPart.chassisQuat);
      mainComposite.addLink(roadTrain.chassis.visible,cabinPart.visible);
      mainComposite.addLink(mainComposite.timeStamp,cabinPart.timeStamp);

      cabinPart.addFunction(updateFromChassis);
    }
  }
}

mainComposite.utils.makePhysicCompound(compoundParts);

  roadTrain.chassis.set({
    mass:roadTrain.chassisMass , 
    physicStatus:false
   });
  mainComposite.addLink(roadTrain.chassis.position, roadTrain.position);
  mainComposite.addLink(roadTrain.chassis.quaternion, roadTrain.quaternion);


  for (let i=0,len=roadTrain.wheels.length;i<len;++i){
    roadTrain.addLink(roadTrain.wheels[i].body , roadTrain.wheelsBodies[i]);
    roadTrain.addLink(roadTrain.suspensions[i].body , roadTrain.suspensionsBodies[i]);
  }
  roadTrain.addLink(roadTrain.chassis.body , roadTrain.chassisBody);
  return true;
  function updateFromChassis({chassisPos,chassisQuat,mesh,timeStamp}){
    let cabinLocalPos = new THREE.Vector3(localPosition.x,localPosition.y,localPosition.z);
    let cabinLocalQuat =  new THREE.Quaternion(localQuaternion.x,localQuaternion.y,localQuaternion.z,localQuaternion.w);
    let chassisPosThree = new THREE.Vector3(chassisPos.x,chassisPos.y,chassisPos.z);
    let chassisQuatThree =  new THREE.Quaternion(chassisQuat.x,chassisQuat.y,chassisQuat.z,chassisQuat.w);

    cabinLocalPos.applyQuaternion(chassisQuatThree);
    cabinLocalPos.add(chassisPosThree)
    cabinLocalQuat.multiply(chassisQuatThree);
    mesh.position.set(cabinLocalPos.x,cabinLocalPos.y,cabinLocalPos.z);
    mesh.quaternion.set(cabinLocalQuat.x,cabinLocalQuat.y,cabinLocalQuat.z,cabinLocalQuat.w);

  }
}


