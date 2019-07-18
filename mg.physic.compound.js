
import { shape , getMaterial } from "./mg.physic.js"

export function makePhysicCompound(mainComposite , sceneObjects){
  if (!sceneObjects[0].physicMaterial) sceneObjects[0].physicMaterial= "objectMaterial";
  if (!sceneObjects[0].linearDamping) sceneObjects[0].linearDamping = 0.15;
  if (!sceneObjects[0].angularDamping) sceneObjects[0].angularDamping = 0.15;


  sceneObjects[0].compoundPosition = undefined;// choose correctly inside the shape


  for (let sceneObject of sceneObjects){
    if (!sceneObject.cylinderSegments) sceneObject.cylinderSegments = 16;
    if (!sceneObject.quaternion) sceneObject.quaternion = new CANNON.Quaternion();
    if (sceneObject===sceneObjects[0]){
      sceneObject.centerOfGravity = true;
    }else{
      sceneObject.centerOfGravity = undefined;
    }
    sceneObject.addFunction(shape);
    sceneObject.addFunction(getMaterial);

    sceneObject.addFunction(relativePosition);
    sceneObject.addFunction(relativeQuaternion);
    sceneObject.addFunction(body);
    sceneObject.addFunction(addToCompoundBody);
    sceneObject.addFunction(updateCompoundBody);
    sceneObject.addFunction(readCompoundBodyShapeNumber);


    mainComposite.addLink(mainComposite.physicSettings.materials , sceneObject.materials);
    mainComposite.addLink(mainComposite.cannon , sceneObject.cannon);

    mainComposite.addLink(sceneObjects[0].mass , sceneObject.mass);
    mainComposite.addLink(sceneObjects[0].physicMaterial , sceneObject.physicMaterial);
    mainComposite.addLink(sceneObjects[0].compoundPosition , sceneObject.compoundPosition);
    mainComposite.addLink(sceneObjects[0].body , sceneObject.body);
    mainComposite.addLink(mainComposite.timeStamp , sceneObject.timeStamp);

  }
}

function readCompoundBodyShapeNumber({compoundBodyShapeNumber}){
  return true;
}
//
function relativePosition({compoundPosition  }){
  if (relativePosition) return relativePosition;
  return new CANNON.Vec3(position.x - compoundPosition.x  , position.y - compoundPosition.y , position.z - compoundPosition.z );
}

function relativeQuaternion({quaternion}){
  return new CANNON.Quaternion(quaternion.x , quaternion.y , quaternion.z , quaternion.w);
}

function body({mass , physicMaterial , cannon , centerOfGravity , compoundPosition , shape , relativePosition , relativeQuaternion}){
  if (body) cannon.remove(body);
  let newBody = new CANNON.Body({mass:mass , material:physicMaterial});
  newBody.position.set(compoundPosition.x , compoundPosition.y , compoundPosition.z);
  newBody.quaternion = new CANNON.Quaternion();
  newBody.linearDamping = linearDamping;
  newBody.angularDamping = angularDamping;

  cannon.add(newBody);
  return newBody;
}



function addToCompoundBody({body , relativePosition , shape , relativeQuaternion}){
    compoundBodyShapeNumber = body.shapes.length ;
    body.addShape(shape , relativePosition, relativeQuaternion);
  return shape;
}

const updateCompoundBody = function({timeStamp , addToCompoundBody}){
  let threeQuaternion = new THREE.Quaternion();
  threeQuaternion.set(body.quaternion.x , body.quaternion.y  ,body.quaternion.z  ,body.quaternion.w )
  let orientation = new THREE.Quaternion(relativeQuaternion.x , relativeQuaternion.y ,relativeQuaternion.z , relativeQuaternion.w);
  let newPos = new THREE.Vector3(relativePosition.x , relativePosition.y ,relativePosition.z );
  newPos.applyQuaternion(threeQuaternion);
  orientation.multiply(threeQuaternion)
  sceneUpdate.position.x = body.position.x + newPos.x;
  sceneUpdate.position.y = body.position.y + newPos.y;
  sceneUpdate.position.z = body.position.z + newPos.z;

  sceneUpdate.quaternion.x = orientation.x;
  sceneUpdate.quaternion.y = orientation.y;
  sceneUpdate.quaternion.z =  orientation.z;
  sceneUpdate.quaternion.w = orientation.w;
}
