
export function addPhysicBody(mainComposite , sceneObject){
  if (!sceneObject.physicMaterial) sceneObject.physicMaterial= "objectMaterial";
  if (!sceneObject.linearDamping) sceneObject.linearDamping = 0.15;
  if (!sceneObject.angularDamping) sceneObject.angularDamping = 0.15;

  if (!sceneObject.cylinderSegments) sceneObject.cylinderSegments = 16;

  sceneObject.addFunction(shape);
  sceneObject.addFunction(body);
  sceneObject.addFunction(getMaterial);
  sceneObject.addFunction(updatePhysic);
  //
  mainComposite.addLink(mainComposite.cannon , sceneObject.cannon);
  mainComposite.addLink(mainComposite.physicSettings.materials , sceneObject.materials);
  mainComposite.addLink(mainComposite.timeStamp , sceneObject.timeStamp);
}

const updatePhysic = function({timeStamp , body}){
  if (body && mass!=0){
    sceneUpdate.position.x = body.position.x;
    sceneUpdate.position.y = body.position.y;
    sceneUpdate.position.z = body.position.z;
    //
    sceneUpdate.quaternion.x = body.quaternion.x;
    sceneUpdate.quaternion.y = body.quaternion.y;
    sceneUpdate.quaternion.z = body.quaternion.z;
    sceneUpdate.quaternion.w = body.quaternion.w;
  }
}

export function getMaterial({materials , physicMaterial}){
  if (physicMaterial in materials){
    return materials[physicMaterial];
  }else{
    return undefined;
  }
}

const body = function({sceneUpdate , getMaterial , shape , mass , cannon }){
  if (body){
    cannon.remove(body);
  }
  if (!sceneUpdate){
    return false;
  }
  let cannonBody = new CANNON.Body({mass:mass , shape: shape , material: getMaterial });
  cannonBody.position.x = sceneUpdate.position.x;
  cannonBody.position.y = sceneUpdate.position.y;
  cannonBody.position.z = sceneUpdate.position.z;
  //
  cannonBody.quaternion.x = sceneUpdate.quaternion.x;
  cannonBody.quaternion.y = sceneUpdate.quaternion.y;
  cannonBody.quaternion.z = sceneUpdate.quaternion.z;
  cannonBody.quaternion.w = sceneUpdate.quaternion.w;
  //
  cannonBody.linearDamping = linearDamping;
  cannonBody.angularDamping = angularDamping;

  cannon.add(cannonBody);
  return cannonBody;
}

export function shape ({geometryName , dimension , scale}){
  let result;
  switch (geometryName){
    case "plane":
      result = new CANNON.Plane();
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

  }

  return result;
}
