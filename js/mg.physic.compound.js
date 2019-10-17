
import { 
  shape , 
  getMaterial , 
  setActivityStatus , 
  setStatus ,
  body , 
  setAllowSleep,
  collisionGroupCode , 
  contactGroupsMask , 
  setBodyCollisionGroups, 
  setCollisionCallback,
  resetBody
} from "./mg.physic.js"

export function makePhysicCompound(mainComposite , components){
  components[0].cannon = mainComposite.cannon.getProxyLessObject;
  components[0].materials = mainComposite.physicSettings.materials.getProxyLessObject;
  components[0].collisionGroupsNames = mainComposite.collisionGroupsNames.getProxyLessObject;
  components[0].mainComposite = mainComposite;
  components[0].self = components[0];
  components[0].totalConstraints = 0;

  //mainComposite.addLink(mainComposite.collisionGroupsNames , components[0].collisionGroupsNames);

  if (!components[0].physicMaterial) components[0].physicMaterial= "objectMaterial";
  if (!components[0].linearDamping) components[0].linearDamping = 0.15;
  if (!components[0].angularDamping) components[0].angularDamping = 0.15;
  if (!components[0].cylinderSegments) components[0].cylinderSegments = 16;
  if(components[0].widthSegments == undefined)components[0].widthSegments =32;
  if(components[0].heightSegments == undefined)components[0].heightSegments = 32;
  if(components[0].radialSegments == undefined)components[0].radialSegments = 32;
  if(components[0].cylinderHeightSegments == undefined)components[0].cylinderHeightSegments = 1;
  if (!components[0].allowSleep) components[0].allowSleep = false;

  if (components[0].physicStatus===undefined) components[0].physicStatus = true;
  if (components[0].sleep==undefined) components[0].sleep = false;
  if (components[0].timeStamp==undefined) components[0].timeStamp = 0;
  if (components[0].bodyType==undefined) components[0].bodyType = "dynamic";
  if (components[0].groupName==undefined) components[0].groupName = "all";
  if (components[0].collisionGroups==undefined) components[0].collisionGroups = ["all"];


  components[0].addFunction(setStatus);
  components[0].addFunction(setActivityStatus);
  components[0].addFunction(getMaterial);
  components[0].addFunction(shape);
  components[0].addFunction(body);
  components[0].addFunction(updateCompoundBody);
  components[0].addFunction(setAllowSleep);
  components[0].addFunction(collisionGroupCode);
  components[0].addFunction(contactGroupsMask);
  components[0].addFunction(setBodyCollisionGroups);
  components[0].addFunction(setCollisionCallback);
  components[0].addFunction(resetBody);






  components[0].components = [];

  for (let i=1,len=components.length;i<len;++i){
    components[0].components.push(components[i].getProxyLessObject);
    if (!components[i].cylinderSegments) components[i].cylinderSegments = 16;
    components[i].addFunction(shape);
    components[i].addFunction(addPhysicToLoadedObjects);
    components[i].addFunction(addToCompoundBody);
    components[i].mainComposite = mainComposite;
    mainComposite.addLink(components[0].body , components[i].body);
    mainComposite.addLink(components[0].visible , components[i].visible);
    if (!components[i].cylinderSegments) components[i].cylinderSegments = 16;
    if(components[i].widthSegments == undefined)components[i].widthSegments =32;
    if(components[i].heightSegments == undefined)components[i].heightSegments = 32;
    if(components[i].radialSegments == undefined)components[i].radialSegments = 32;
    if(components[i].cylinderHeightSegments == undefined)components[i].cylinderHeightSegments = 1;

    components[i].compoundBodyShapeNumber = undefined;

  }
}

function addPhysicToLoadedObjects({addToCompoundBody}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(shape);
  return true;
}

function addToCompoundBody({body ,shape }){
  if (addToCompoundBody) return addToCompoundBody;
  let pos = body.position;
  let bodyQuat = new THREE.Quaternion(body.quaternion.x,body.quaternion.y,body.quaternion.z,body.quaternion.w);
  let thisQuat = new THREE.Quaternion(quaternion.x,quaternion.y,quaternion.z,quaternion.w);
  let thisPos = new THREE.Vector3(position.x - pos.x, position.y - pos.y , position.z - pos.z);
  bodyQuat.normalize().inverse()
  thisPos.applyQuaternion(bodyQuat);

  thisQuat.multiply(bodyQuat);
  compoundBodyShapeNumber = body.shapes.length ;
  body.addShape(
    shape,  
    new CANNON.Vec3(thisPos.x,thisPos.y,thisPos.z ), 
    new CANNON.Quaternion(thisQuat.x , thisQuat.y , thisQuat.z , thisQuat.w)
    );


  return shape;
}

const updateCompoundBody = function({timeStamp , body}){
  let pos = body.position;
  let quat = body.quaternion;
  position = pos;
  quaternion = quat;

  for (let component of components){
    let n = component.compoundBodyShapeNumber;
    let offset = body.shapeOffsets[n]; 
    let ori = body.shapeOrientations[n];
    if (ori && offset){
      let compQuat = new THREE.Quaternion(quat.x,quat.y,quat.z,quat.w);
      let oriQuat = new THREE.Quaternion(ori.x,ori.y,ori.z,ori.w);
      let localPos = new THREE.Vector3(offset.x,offset.y,offset.z);
      localPos.applyQuaternion(compQuat );
      compQuat.multiply(oriQuat);
      component.mesh.position.set(localPos.x + pos.x ,localPos.y + pos.y ,localPos.z + pos.z);
      component.mesh.quaternion.set(compQuat.x,compQuat.y,compQuat.z,compQuat.w);
    }

  }
}
