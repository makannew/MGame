
export function addPhysicBody(mainComposite , obj){
  obj.cannon = mainComposite.cannon.getProxyLessObject;
  obj.collisionGroupsNames = mainComposite.collisionGroupsNames.getProxyLessObject;
  obj.materials = mainComposite.physicSettings.materials.getProxyLessObject;
  obj.mainComposite = mainComposite;
  obj.self = obj;
  obj.totalConstraints = 0;
  //mainComposite.addLink(mainComposite.collisionGroupsNames , obj.collisionGroupsNames);


  if (!obj.physicMaterial) obj.physicMaterial= "objectMaterial";
  if (!obj.linearDamping) obj.linearDamping = 0.15;
  if (!obj.angularDamping) obj.angularDamping = 0.15;
  if (!obj.allowSleep) obj.allowSleep = false; // allow cannon put sleep non-intracting object
  if (!obj.cylinderSegments) obj.cylinderSegments = 16;
  if (obj.physicStatus===undefined) obj.physicStatus = true; //temporaryly remove from physic world if false
  if (obj.sleep==undefined) obj.sleep = false; // temporarily detach from updating loop
  if (obj.bodyType==undefined) obj.bodyType = "dynamic";
  if (obj.groupName==undefined) obj.groupName = "all";
  if (obj.collisionGroups==undefined) obj.collisionGroups = ["all"];


  obj.addFunction(shape);
  obj.addFunction(body);
  obj.addFunction(getMaterial);
  obj.addFunction(updatePhysic);
  obj.addFunction(setStatus);
  obj.addFunction(setActivityStatus);
  obj.addFunction(addPhysicToLoadedObjects);
  obj.addFunction(setAllowSleep);
  obj.addFunction(collisionGroupCode);
  obj.addFunction(contactGroupsMask);
  obj.addFunction(setBodyCollisionGroups);
  obj.addFunction(setCollisionCallback);
  obj.addFunction(resetBody);




}

export function resetBody({reset , body}){
  body.linearDamping = linearDamping;
  body.angularDamping = angularDamping;
  // Position
  body.position.set(position.x , position.y , position.z);
  body.previousPosition.set(position.x , position.y , position.z);//.setZero();
  body.interpolatedPosition.set(position.x , position.y , position.z);
  body.initPosition.set(position.x , position.y , position.z);

  // orientation
  body.quaternion.set(quaternion.x , quaternion.y , quaternion.z , quaternion.w);
  body.initQuaternion.set(quaternion.x , quaternion.y , quaternion.z , quaternion.w);
  //body.previousQuaternion.set(0,0,0,1);
  body.interpolatedQuaternion.set(quaternion.x , quaternion.y , quaternion.z , quaternion.w);

  // Velocity
  body.velocity.setZero();
  body.initVelocity.setZero();
  body.angularVelocity.setZero();
  body.initAngularVelocity.setZero();

  // Force
  body.force.setZero();
  body.torque.setZero();

  // Sleep state reset
  body.sleepState = 0;
  body.timeLastSleepy = 0;
  body._wakeUpAfterNarrowphase = false;
  reset = undefined;
}

export function setBodyCollisionGroups({collisionGroupCode,contactGroupsMask,body}){
  body.collisionFilterGroup = collisionGroupCode;
  body.collisionFilterMask = contactGroupsMask;
}

export function collisionGroupCode({groupName}){
  if (!collisionGroupsNames.includes(groupName)){
    collisionGroupsNames.push(groupName);
  }
  return Math.pow(2, collisionGroupsNames.indexOf(groupName));

}

export function contactGroupsMask({collisionGroups}){
  let result = 0;
  for (let collisionGroup of collisionGroups){
    if (!collisionGroupsNames.includes(collisionGroup)){
      collisionGroupsNames.push(collisionGroup);
    }
    if (collisionGroup=="all") return ~0;
    result = result | Math.pow(2, collisionGroupsNames.indexOf(collisionGroup));
  }
  return result;
}

export function setAllowSleep({body,allowSleep}){
  body.allowSleep = allowSleep;
}

function addPhysicToLoadedObjects({body}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(body);
  return true;
}

export function setActivityStatus({sleep}){
  if (sleep){
    if (timeStamp){
      mainComposite.removeLink(self.timeStamp);
    }
  }else{
    mainComposite.addLink(mainComposite.timeStamp , self.timeStamp);

  }
}

const updatePhysic = function({timeStamp , body}){
  let pos = body.position;
  let quat = body.quaternion;
  position = pos;
  quaternion = quat;
}

export function getMaterial({materials , physicMaterial}){
  if (physicMaterial in materials){
    return materials[physicMaterial];
  }else{
    return undefined;
  }
}

export function setStatus({body,physicStatus,totalConstraints}){
  if(physicStatus && !setStatus){
    cannon.addBody(body);
    return true
  }
  if(setStatus && !physicStatus && (setCollisionCallback==undefined || !setCollisionCallback) && totalConstraints==0){
    mainComposite.getProxyLessObject.removeBodies.push(body);
  }
}

export function setCollisionCallback({body , collisionCallback, enableCollisionCallback}){
  if (enableCollisionCallback && !setCollisionCallback){
    body.addEventListener("collide", collisionCallback);
    return true;
  }
  if (setCollisionCallback && !enableCollisionCallback ){
    body.removeEventListener("collide");
    physicStatus = physicStatus;
    return false;
  }
}


export function body({mesh , getMaterial , shape , mass}){
  if (body) return body;
  let newBody = new CANNON.Body({mass , shape , material:getMaterial,allowSleep});
  // newBody.position.set(position.x , position.y , position.z);
  // newBody.quaternion.set(quaternion.x , quaternion.y , quaternion.z , quaternion.w);
  // newBody.linearDamping = linearDamping;
  // newBody.angularDamping = angularDamping;
    switch (bodyType){
      case "dynamic":
        newBody.type = CANNON.Body.DYNAMIC;
        break;
      case "kinematic":
        newBody.type = CANNON.Body.KINEMATIC;
        break;
      case "static":
        newBody.type = CANNON.Body.STATIC ;
        break;
    }
  reset = true;
  return newBody;
}

export function shape ({geometryName , dimension , scale}){
  let result;
  switch (geometryName){
    case "plane":
      if (heightData){
        result = new CANNON.Heightfield(heightData, {elementSize:dimension.width/dimension.xSeg});// error: heightData need to converted 
      }else{
        result = new CANNON.Plane();
      }
      break;
    case "box":
      result =  new CANNON.Box(new CANNON.Vec3(dimension.length * scale/2 ,dimension.width * scale/2 ,dimension.height * scale/2));
      break;
    case "sphere":
      result = new CANNON.Sphere(dimension.radius * scale);
      break;
    case "cylinder":
      result = new CANNON.Cylinder( dimension.radiusTop, dimension.radiusBottom , 
        dimension.height,cylinderSegments);
        let quat = new CANNON.Quaternion();
        quat.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        let translation = new CANNON.Vec3(0,0,0);
        result.transformAllPoints(translation,quat);
      break;
    case "polyhedron":
      let cannonVertices =[];
      let cannonFaces = [];
      for (let i=0,len=dimension.vertices.length/3;i<len;++i){
        cannonVertices.push(new CANNON.Vec3(dimension.vertices[i],dimension.vertices[i+1],dimension.vertices[i+2]));
      }
      for (let i=0,len=dimension.faces.length/3;i<len;++i){
        cannonFaces.push([dimension.faces[i],dimension.faces[i+1],dimension.faces[i+2]]);
      }

      result = new CANNON.ConvexPolyhedron(cannonVertices, cannonFaces);

    break;

  }

  return result;
}
