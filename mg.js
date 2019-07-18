
import CompositeObject from "../composer.js"
import { addCamera, activeCamera } from "./mg.camera.js"
import { newObject } from "./mg.object.js"
import { activeWorld , addSkyBox} from "./mg.skyBox.js"
import { startEngine } from "./mg.startEngine.js"
import { initializeThreeJs ,settings } from "./mg.initialize.js"
import { newLight } from "./mg.light.js"
import { cannonSettingsBuilder } from "./mg.physic.settings.js"
import { addPhysicBody } from "./mg.physic.js"
import { makePhysicCompound } from "./mg.physic.compound.js"
import { newLockConstraint } from "./mg.constraints.lock.js"
import { newPointsConstraint } from "./mg.constraints.points.js"
import { newDistanceConstraint } from "./mg.constraints.distance.js"
import { newHingeConstraint } from "./mg.constraints.hinge.js"


export function MGame(){
  let result = CompositeObject();
  result.three = initializeThreeJs();

  result.utils = {};
  result.utils.addCamera = function(cameraName){addCamera(result , cameraName);}
  result.utils.newLight = function(lightName){newLight(result , lightName);}
  result.utils.newObject = function(objectName){newObject(result , objectName);}
  result.utils.addSkyBox = function(skyBoxName){addSkyBox(result , skyBoxName);}
  result.utils.addPhysicBody = function(sceneObject){addPhysicBody(result , sceneObject);}
  result.utils.makePhysicCompound = function(sceneObjects){makePhysicCompound(result , sceneObjects);}
  result.utils.newLockConstraint = function(constraintName){newLockConstraint(result , constraintName);}
  result.utils.newPointsConstraint = function(constraintName){newPointsConstraint(result , constraintName);}
  result.utils.newDistanceConstraint = function(constraintName){newDistanceConstraint(result , constraintName);}
  result.utils.newHingeConstraint = function(constraintName){newHingeConstraint(result , constraintName);}


  result.utils.start = startEngine;

  result.sceneObjects = {};
  result.cameras = {};
  result.worlds = {};
  result.lights ={};
  result.constraints = {};

  cannonSettingsBuilder(result);

  result.actualInterval = 0;
  result.running = false;
  result.needsUpdate = undefined;

  result.addFunction(demandInterval);
  // default values
  result.settings = settings;

  result.addFunction(activeCamera);
  result.addFunction(activeWorld);
  result.addFunction(newAnimationFrame);

  return result;
}

const newAnimationFrame = function({timeStamp , three , activeCamera , cannon}){
  cannon.step(demandInterval , actualInterval , settings.maxSubStep);

  three.renderer.render( three.scene , activeCamera);
  return true;
}

const demandInterval = function({settings}){
  return 1/settings.frameRate;

}


