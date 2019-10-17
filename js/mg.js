/**
 * MGame is a javascript game  engine built  
 * on top of CANNON.js and THREE.js.
 *
 * @link   https://github.com/makannew/MGame
 * @file   mg.js
 * @author Makan Edrisi
 * @since  2019
 * @version 1.0.0
 */

import CompositeObject from "./dependencies/composer.js"
import { addCamera } from "./mg.camera.js"
import { addObject } from "./mg.object.js"
import { addSkyBox} from "./mg.skyBox.js"
import { startEngine } from "./mg.startEngine.js"
import { initializeThreeJs ,settings } from "./mg.initialize.js"
import { addLight } from "./mg.light.js"
import { cannonSettingsBuilder } from "./mg.physic.settings.js"
import { addPhysicBody } from "./mg.physic.js"
import { makePhysicCompound } from "./mg.physic.compound.js"
import { newLockConstraint } from "./mg.constraints.lock.js"
import { newPointsConstraint } from "./mg.constraints.points.js"
import { newDistanceConstraint } from "./mg.constraints.distance.js"
import { newHingeConstraint } from "./mg.constraints.hinge.js"
import { newRigidVehicle } from "./mg.physic.rigidVehicle.js";
import { newRayCastVehicle } from "./mg.physic.rayCastVehicle.js";
import { newRoadTrain } from "./mg.roadTrain.js";



export function MGame(){

  let result = CompositeObject();
  result.composerConfig({upPropagation:false});

  result.loadedObjects = [];
  result.three = initializeThreeJs(result);
  result.activeCamera = undefined;
  result.collisionGroupsNames = ["all"];

  result.utils = {};
  result.utils.addCamera = function(newCamera){addCamera(result , newCamera);}
  result.utils.addLight = function(newLight){addLight(result , newLight);}
  result.utils.addObject = function(newObject){addObject(result , newObject);}
  result.utils.addSkyBox = function(newSkyBox){addSkyBox(result , newSkyBox);}
  result.utils.addPhysicBody = function(sceneObject){addPhysicBody(result , sceneObject);}
  result.utils.makePhysicCompound = function(sceneObjects){makePhysicCompound(result , sceneObjects);}
  result.utils.newLockConstraint = function(constraintName){newLockConstraint(result , constraintName);}
  result.utils.newPointsConstraint = function(constraintName){newPointsConstraint(result , constraintName);}
  result.utils.newDistanceConstraint = function(constraintName){newDistanceConstraint(result , constraintName);}
  result.utils.newHingeConstraint = function(constraintName){newHingeConstraint(result , constraintName);}
  result.utils.newRigidVehicle = function(vehicleName){newRigidVehicle(result , vehicleName);}
  result.utils.newRayCastVehicle = function(vehicleName){newRayCastVehicle(result , vehicleName);}
  result.utils.newRoadTrain = function(roadTrain){newRoadTrain(result , roadTrain)};

  result.utils.start = startEngine;
  result.self = result;

  result.cameras = {};
  result.worlds = {};
  result.lights ={};

  cannonSettingsBuilder(result);

  result.actualInterval = 0;
  result.running = false;

  // default values
  result.settings = settings;

  result.addFunction(newAnimationFrame);
  result.loadedObjects.push(result);
  result.removeBodies = [];

  return result;
}

const newAnimationFrame = function({timeStamp , three , activeCamera , cannon}){
  three.renderer.render( three.scene , activeCamera);
  let t = actualInterval;
  let s = cannonSafeStep;
  if (removeBodies.length>0){
    cannon.remove(removeBodies.pop());
  }
  while (t>=s){
    cannon.step(s);
    t -=s;
  }
  actualInterval = t;

  return true;
}

