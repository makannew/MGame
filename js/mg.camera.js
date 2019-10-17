
export function addCamera(mainComposite , newCamera){
    newCamera.loadedObjects = mainComposite.loadedObjects.getProxyLessObject;
    newCamera.addFunction(addToLoadedObjects);

    //mainComposite.addLink(mainComposite.activeCamera , newCamera.activeCamera);
    newCamera.three = mainComposite.three.getProxyLessObject;
    newCamera.mainComposite = mainComposite;

    newCamera.position = {x:0,y:0,z:0};
    newCamera.quaternion = {x:0,y:0,z:0,w:0};
    newCamera.addFunction(camera);
    newCamera.addFunction(activate);
    newCamera.addFunction(setPosition);
    newCamera.addFunction(setQuaternion);
    newCamera.addFunction(setActiveCamera);
    newCamera.addFunction(cameraUpdateFunction);

}

function addToLoadedObjects({camera}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(camera);
  return true;
}


function camera({cameraFocalLenght , cameraNearView , cameraFarView}){

  let result = new THREE.PerspectiveCamera ( 
    cameraFocalLenght , 
    window.innerWidth / window.innerHeight , 
    cameraNearView, 
    cameraFarView);
  return result;
}

function setPosition({camera , position}){
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;
  return true;
}

function setQuaternion({camera , quaternion}){
  camera.quaternion.x = quaternion.x;
  camera.quaternion.y = quaternion.y;
  camera.quaternion.z = quaternion.z;
  camera.quaternion.w = quaternion.w;
  return true;
}

function cameraUpdateFunction({camera,three}){
  let result = function () {
    three.renderer.setSize ( window.innerWidth , window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  return result;
}
function activate({active , cameraUpdateFunction}){
  if (active){
    if (!activate){
      window.addEventListener('resize', cameraUpdateFunction);
    }
    return true;
  }else{
    if (activate){
      window.removeEventListener('resize' , cameraUpdateFunction);
    }
    return false;
  }
}

function setActiveCamera({activate , camera}){
  if (activate && camera){
    mainComposite.activeCamera = camera;
  };
}