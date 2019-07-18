import { newObject } from "./mg.object.js"

export function addSkyBox(mainComposite , skyBoxName){
  mainComposite.worlds[skyBoxName] = {scale:1 , visible:false , name:skyBoxName , WorldPosition:{x:0,y:0,z:0} , worldDimension:undefined};
  mainComposite.worlds[skyBoxName].addFunction(worldDimension);
  mainComposite.worlds[skyBoxName].addFunction(readTexture);

  let components = mainComposite.worlds[skyBoxName].components = [skyBoxName+"_back",
                        skyBoxName+"_front",
                        skyBoxName+"_left",
                        skyBoxName+"_right",
                        skyBoxName+"_top",
                        skyBoxName+"_ground"
                      ];
  for (let name of components){
    newObject(mainComposite , name);
    mainComposite.sceneObjects[name].addFunction(changePositions);

  }
  for (let prop of ["scale" , "visible" , "WorldPosition" , "worldDimension"]){
    mainComposite.addLink(mainComposite.worlds[skyBoxName][prop] , mainComposite.sceneObjects[components[0]][prop] , 
      mainComposite.sceneObjects[components[1]][prop] , mainComposite.sceneObjects[components[2]][prop] , 
      mainComposite.sceneObjects[components[3]][prop] , mainComposite.sceneObjects[components[4]][prop] , 
      mainComposite.sceneObjects[components[5]][prop]);
  }
  for (let i=0;i<components.length;++i){
    mainComposite.addLink(mainComposite.sceneObjects[components[i]].texture , mainComposite.worlds[skyBoxName]["texture"+ String(i)]);
  }
}

const worldDimension = function({texture0,texture1,texture2,texture3,texture4,texture5}){
  return {length: proxiedComposite.sceneObjects[components[5]].dimension.length,
                    width: proxiedComposite.sceneObjects[components[5]].dimension.width,
                    height: proxiedComposite.sceneObjects[components[0]].dimension.width
                    };
}

const readTexture = function({textureFilePath , components}){
  for (let i=0;i<components.length;++i){
    proxiedComposite.sceneObjects[components[i]].textureFileName = textureFilePath + components[i] + ".png";
  }
  return true;
}

const changePositions = function({WorldPosition , worldDimension , needsUpdate}){
  let componentName = currentAddress[currentAddress.length - 1].split("_")[1];
  let x = WorldPosition.x;
  let y = WorldPosition.y;
  let z = WorldPosition.z;

  let l = worldDimension.length * scale/ 2;
  let w = worldDimension.width * scale/ 2;
  let h = worldDimension.height * scale/ 2;

  // reset position
  mesh.position.set(0,0,0);

  switch (componentName){
    case "top":
      mesh.quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI / 2 );
      mesh.rotateOnWorldAxis( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
      mesh.position.set(x,y+h,z);
      break;
    case "ground":
      mesh.quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -Math.PI / 2 );
      mesh.rotateOnWorldAxis( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
      mesh.position.set(x,y-h,z);
      break;
    case "front":
        mesh.position.set(x,y,z-l);
      break;
    case "back":
        mesh.quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI );
        mesh.position.set(x,y,z+l);
      break;
    case "left":
        mesh.quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
        mesh.position.set(x-w,y,z);
      break;
    case "right":
        mesh.quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -Math.PI / 2 );
        mesh.position.set(x+w,y,z);
      break;
  }
  return true;
}

export const activeWorld = function({activeWorldName}){
  // remove previous world if there is
  if (activeWorld && activeWorld!=activeWorldName){
    proxiedComposite.worlds[activeWorld].visible = false;
  }
  proxiedComposite.worlds[activeWorldName].visible = true;
  return activeWorldName;
}
