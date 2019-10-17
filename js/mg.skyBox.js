import { addObject } from "./mg.object.js"
import { addPhysicBody } from "./mg.physic.js"

export function addSkyBox(mainComposite , skyBoxName){
  skyBoxName.loadedObjects = mainComposite.loadedObjects.getProxyLessObject;
  skyBoxName.addFunction(addToLoadedObjects);
  skyBoxName.mainComposite = mainComposite;

  skyBoxName.scale=1;
  skyBoxName.visible=false;
  skyBoxName.WorldPosition={x:0,y:0,z:0};
  skyBoxName.filesExtension = ".png";
  skyBoxName.thickness = 1;
  skyBoxName.geometryName = undefined;
  skyBoxName.physicBody = true;
  skyBoxName.components = [];
  skyBoxName.selfProxy = skyBoxName;
  for (let i=0,len=skyBoxName.worldFileNames.length;i<len;++i){
    skyBoxName.components[i]={};
    addObject(mainComposite,skyBoxName.components[i]);
    addPhysicBody(mainComposite,skyBoxName.components[i]);
    mainComposite.addLink(skyBoxName.components[i].texture,skyBoxName["texture"+ String(i)]);
    skyBoxName.components[i].set({
      bodyType:"static",
      mass:0 , 
      physicMaterial:"groundMaterial" ,
      geometryName:"box" , 
      receiveShadow:(i==5) ? true:false,// only ground receive shadow
      sleep:true,
      textureFileName: skyBoxName.textureFilePath + skyBoxName.worldFileNames[i] + skyBoxName.filesExtension
    });
  }
  skyBoxName.addFunction(allLoaded);
  skyBoxName.addFunction(setGeometries);
  for (let prop of ["scale" , "visible"]){
    mainComposite.addLink(skyBoxName[prop] , skyBoxName.components[0][prop] , skyBoxName.components[1][prop],
      skyBoxName.components[2][prop],skyBoxName.components[3][prop],skyBoxName.components[4][prop],skyBoxName.components[5][prop]);
  }
}

function addToLoadedObjects({setGeometries}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(selfProxy);
  return true;
}

function setGeometries({WorldPosition,worldDimension,allLoaded, thickness}){
  let l = worldDimension.x;
  let w = worldDimension.y;
  let h = worldDimension.z;
  let t = thickness;
  // front
  selfProxy.components[1].position = {x:0,y:0,z:-h/2};
  selfProxy.components[1].dimension = {length:l*scale,width:w*scale,height:t*scale};

  // back
  selfProxy.components[0].position = {x:0,y:0,z:h/2};
  selfProxy.components[0].dimension = {length:l*scale,width:w*scale,height:t*scale};

  // top
  selfProxy.components[4].position = {x:0,y:w/2,z:0};
  selfProxy.components[4].dimension = {length:l*scale,width:t*scale,height:h*scale};

  // ground
  selfProxy.components[5].position = {x:0,y:-w/2,z:0};
  selfProxy.components[5].dimension = {length:l*scale,width:t*scale,height:h*scale};

  // left
  selfProxy.components[2].position = {x:-l/2,y:0,z:0};
  selfProxy.components[2].dimension = {length:t*scale,width:w*scale,height:h*scale};

  // right
  selfProxy.components[3].position = {x:+l/2,y:0,z:0};
  selfProxy.components[3].dimension = {length:t*scale,width:w*scale,height:h*scale};
  return true;
}

const allLoaded = function({texture0,texture1,texture2,texture3,texture4,texture5}){
  return true;
}
