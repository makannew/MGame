
let t = gameEngine();


t.threeScene = t.initializeScene();

t.cameras.camera1 = t.newCamera(); 
t.cameras.camera1.set ({cameraFocalLenght: 55 , cameraNearView: 1 , cameraFarView: 1000});
t.activeCamera = "camera1";
t.cameras.camera1.cameraFocalLenght = 63; // changing a property cause auto updating process

t.sceneObjects.worldBack = t.newObject();
t.sceneObjects.worldBack.textureFileName = "world/world1/world_back.png";




// t.threeScene = t.newScene();
// t.camera1 = t.newCamera();
// t.camera1.set ({cameraFocalLenght: 55 , cameraNearView: 1 , cameraFarView: 1000});
// t.activeCamera = t.camera1;


// t.worldBack = t.newImage();

// t.textureFileName = "world/world1/world_back.png";
// t.camera1.cameraFocalLenght = 60;
console.log(t);
