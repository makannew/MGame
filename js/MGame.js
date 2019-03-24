
let updateSceneObjects = function({sceneObjects , threeScene}){
  for (let item in sceneObjects){
    // threeScene.scene.add (item.threeBody)
    console.log(item);
  }
}

let updateActiveCamera = function({activeCamera , threeScene , cameras}){
  addEventListener('resize', function () {
    threeScene.renderer.setSize ( innerWidth , innerHeight);
    cameras[activeCamera].camera.aspect = innerWidth / innerHeight;
    cameras[activeCamera].camera.updateProjectionMatrix ();
  });
  return true;
}


let camera = function({cameraFocalLenght , cameraNearView , cameraFarView}){
  return new THREE.PerspectiveCamera ( 
    cameraFocalLenght , 
    innerWidth / innerHeight , 
    cameraNearView, 
    cameraFarView);
}



let texture = function({textureFileName}){
  let texture={};
  texture.canvas = document.createElement("CANVAS");
  texture.context = texture.canvas.getContext("2d");
  texture.image = document.createElement("IMG");
  let result =new Promise ((resolve , reject)=>{
    texture.image.onload = ()=> {
      texture.canvas.width = texture.image.width;
      texture.canvas.height = texture.image.height;
      texture.context.drawImage(texture.image, 0, 0);
      resolve(texture)
    };
    texture.image.onerror = ()=> resolve(undefined);
  })
  texture.image.src = textureFileName;
  return result;
}

let newCamera = function(){
  let result = CompositeObject();
  result.addFunction(camera);
  return result;
}

let initializeScene = function(){
  let threeScene={};
  // three.js setup
  threeScene.scene = new THREE.Scene ();
  threeScene.renderer = new THREE.WebGLRenderer ();
  threeScene.renderer.shadowMap.enabled = true;
  threeScene.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  threeScene.renderer.setSize ( innerWidth , innerHeight);
  document.body.appendChild ( threeScene.renderer.domElement );
  return threeScene;
}
let newObject = function(){
  let result = CompositeObject();
  result.addFunction(texture);
  return result;
}
let gameEngine = function(){
  let result = CompositeObject();
  result.addFunction(updateActiveCamera);
  result.addFunction(updateSceneObjects);

  result.addMethod(newCamera);
  result.addMethod(initializeScene);
  result.addMethod(newObject);

  return result;
}


