function MakanGameEngine(){ 
  "use strict";
  // Game engine shared properties and methods
  let activeScene = undefined;
  let initialized = false;
  let engineRunning = false;
  let lastTime =undefined;
  let deltaTime = undefined;
  let threeScene = undefined;
  let threeCamera = undefined;
  let renderer = undefined;
  let cannonWorld = undefined;

  let engineLoop = function(timeStamp){
    if (lastTime == undefined){
      lastTime = timeStamp;
    }
    deltaTime += (timeStamp - lastTime) / 1000;
    if (deltaTime >= 1/accessibleObject[activeScene].get("maxFrameRate")){
      renderer.render( threeScene , threeCamera);
      //this.threeCamera.updateProjectionMatrix();
      deltaTime = 0;
    }
    if (engineRunning) requestAnimationFrame(engineLoop);
    }
  let initialize = function(sceneName){
    // three.js setup
    threeScene = new THREE.Scene ();
    threeCamera = new THREE.PerspectiveCamera ( accessibleObject[sceneName].get("cameraFocalLenght") , 
        innerWidth / innerHeight , 
        accessibleObject[sceneName].get("cameraNearView") , accessibleObject[sceneName].get("cameraFarView"));
    renderer = new THREE.WebGLRenderer ();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize ( innerWidth , innerHeight);
    addEventListener('resize', function () {
        renderer.setSize ( innerWidth , innerHeight);
        threeCamera.aspect = innerWidth / innerHeight;
        threeCamera.updateProjectionMatrix ();
    });
    document.body.appendChild ( renderer.domElement );
    // cannon.js setup
    cannonWorld = new CANNON.World();
    cannonWorld.broadphase = new CANNON.NaiveBroadphase();
    //
    
    initialized = true;
  }
  let setProperties = function(options , defaultProperties){
    for (let item in options){
      if (item in defaultProperties){
        defaultProperties[item] = options[item];
      }else{
        throw console.error(item + " is not a property");
      }
    }
  }
  let pushToArray = function(objName , categories){
    if (objName in accessibleObject){
      let objType = accessibleObject[objName]["objectType"];
      if (objType in categories){
        if (!(categories[objType].includes(accessibleObject[objName]))){
          categories[objType].push(accessibleObject[objName]);
          return true;
        }
        throw console.error("Already added!");
      }
      throw console.error("Cannot add this type of objects!");
    }
    throw console.error("object not found!");
  }
  let removeFromArray = function(objName , categories){
    if (objName in accessibleObject){
      let objType = accessibleObject[objName]["objectType"];
      if (objType in categories){
        let objPosition = categories[objType].indexOf(accessibleObject[objName]);
        if (objPosition != -1){
          categories[objType].splice(objPosition , 1);
          return true;
        }
      }
    }
    throw console.error("object not found to remove!");
  }
  let checkDuplicate = function(name){
    if (name in accessibleObject){
      throw console.error("Same name already exist!");
    }
  }
  let handler = {
    set: function ( obj , prop , value ){
      throw console.error("Here properties are not accessible.");
    },
    get: function ( obj , prop ){
      return obj[prop];
    }
  }
  let sceneStructure = function(propName){
    let sceneProperties = {
      cameraFocalLenght: 50,
      cameraNearView: 0.1,
      cameraFarView: 10000,
      maxFrameRate: 120,
      objects: [],
      cameras: [],
      behaviours: [],
      controls: [],
      boards:[]
  };

    let sceneMethods = {
      objectName: propName,
      objectType: "scenes",
      add: function(objName){
        pushToArray(objName , sceneProperties);
      },
      remove: function(objName){
        removeFromArray(objName , sceneProperties);
      },
      set: function(options){setProperties(options , sceneProperties)}, 
      get: function(propName){return sceneProperties[propName]}
                
    }
    let validatedScene = new Proxy(sceneMethods , handler);
    return validatedScene;
  }
  let objectStructure = function(propName){
   
    let objectProperties = {
      material: new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.FrontSide} ),
      receiveShadow: true,
      filename: undefined,
      loaded: false,
      threeObject: new THREE.Mesh(),
      canvas: document.createElement("CANVAS"),
      canvasContext: undefined,
      image: document.createElement("IMG"),
      behaviour: []

    }
    objectProperties.canvasContext = objectProperties["canvas"].getContext("2d");
    let objectMethods = {
      objectName: propName,
      objectType: "objects",
      add: function(objName){
        pushToArray(objName , objectProperties);
      },
      remove: function(objName){
        removeFromArray(objName , objectProperties);
      },
      set: function(options){setProperties(options , objectProperties)}, 
      get: function(propName){return objectProperties[propName]}
    }
    return objectMethods;
  }
let startEngine = function(sceneName){
  activeScene = sceneName;
  initialize(sceneName);
  engineRunning = true;
  engineLoop(0);
}
let stopEngine = function(){
  engineRunning = false;
}
let accessibleObject = {
  newScene: function(propName){
    checkDuplicate(propName);
    accessibleObject[propName] = sceneStructure(propName);
  },
  newObject: function(propName){
    checkDuplicate(propName);
    accessibleObject[propName] = objectStructure(propName);
  },
  start: function(sceneName){startEngine(sceneName)},
  stop: function(){stopEngine()}
}
  // namespace.scenes = {
  //   newScene: function(sceneName){
  //     if (!(sceneName in namespace)) {
  //     namespace[sceneName] = {name: sceneName , type: "scene" , parent: namespace};
  //     namespace[sceneName]["objects"] = {add: function(objName) {namespace.objects.add.call(namespace[sceneName] , objName)} };

  //     } else {
  //       throw console.error("scene name already exist!");
        
  //     }
  //   }

  // }
  // namespace.scene = function(){ 
  //   let categories = {gameObject: "gameObject" , timer: "timer" , counter: "counter" , 
  //                     behaviour: "behaviour" , event: "event" , control: "control"};
  //   let scene = {
  //     add: function(obj){
  //       let propCategory = propID(obj);
  //       if (!(propCategory in scene)){
  //         scene[propCategory]=[];
  //       }
  //       if (scene[propCategory].includes(obj)){
  //         throw console.error("Object already exist, you should remove it first");
  //       }
  //       scene[propCategory].push(obj);
  //     },
  //     remove: function(obj){
  //       let propCategory = propID(obj);
  //       if (propCategory in scene){
  //         let propPosition = scene[propCategory].indexOf(obj);
  //           if (propPosition != -1){
  //             scene[propCategory].splice( propPosition , 1 );
  //             return ;
  //           }
  //       } 
  //       throw console.error("Object not found to remove");
  //     }
  //   }
  //   let propID = function( obj ){
  //     if (typeof(obj) === "object"){
  //       if ("id" in obj){
  //         if (obj["id"] in categories){
  //           return categories[obj["id"]];
  //         }
  //       }
  //     }
  //     throw console.error("Cannot recognize object");
  //   };
  //   let handler = {
  //     set: function ( obj , prop , value ){
  //       throw console.error("Do it through 'add' and 'remove' method ");
        
  //       // let propCategory = propID(prop);
  //       // if (propCategory in obj){
  //       //   if (prop in obj[propCategory]){
  //       //     if (typeof(obj[propCategory][prop])===typeof(value)){
  //       //       obj[propCategory][prop] = value;
  //       //       return true;
  //       //     }
  //       //     throw console.error("illegal attemp to change type of " + prop + " from " + types[prop] + " to " + typeof(value) );
  //       //   }
  //       // } 
  //       //   throw console.error("Cannot add new property, you should do through 'add' method or choose another property name.");
  //     },
  //     get: function ( obj , prop ){
  //       // if (prop === "add" || prop === "remove"){
  //       //   return obj[prop];
  //       // }
  //       // //let propCategory = propID(prop);
  //       return obj[prop];     
  //     }

  //   };
  //   let validatedScene = new Proxy(scene , handler);
  //   return validatedScene;
  // };
  // // namespace.gameScene = function(){
  // //   let sceneObjects = {};
  // //   let id = 0;
  // //   function add(item){
  // //     sceneObjects[id] = item;
  // //     ++id;
  // //   }
  // //   function remove(item){
  // //     delete sceneObjects[item];
  // //   }
  // //   function get(){
  // //     return sceneObjects;
  // //   }
  // //   return Object.freeze({
  // //     add,
  // //     remove,
  // //     get
  // //   })
    
  // // }
let validatedObject = new Proxy(accessibleObject , handler);
return validatedObject;
}
