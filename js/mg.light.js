
export function addLight(mainComposite , newLight){
  newLight.loadedObjects = mainComposite.loadedObjects.getProxyLessObject;
  newLight.addFunction(addToLoadedObjects);
  newLight.mainComposite = mainComposite;

    newLight.color = 0xffffff;
    newLight.intensity = .5;
    newLight.visible = true;
    newLight.position = new THREE.Vector3(0,0,0);
    newLight.targetPosition = new THREE.Vector3(0,0,0);
    newLight.castShadow = false ;
    newLight.shadowMapDarkness = 1;
    newLight.shadowMapSizeWidth = 2048*2;  
    newLight.shadowMapSizeHeight = 2048*2; 
    newLight.shadowCameraNear = 0.5;      
    newLight.shadowCameraFar = 2048*2;   
    newLight.skyColor = 0xffffbb;  
    newLight.groundColor = 0x080820;
    newLight.distance = 0;
    newLight.width = 350;
    newLight.height = 200;

    newLight.addFunction(light);
    newLight.addFunction(needsUpdate);
    newLight.addFunction(setIntensity);
    newLight.addFunction(setColor);
    newLight.addFunction(setGeneralProperties);
    newLight.addFunction(setPosition);

    mainComposite.addLink(mainComposite.three , newLight.three);
}

function addToLoadedObjects({light}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(light);
  return true;
}

function setIntensity ({light , intensity}){
  light.intensity = intensity;
  return true;
}

function setColor ({light , color}){
  light.color = new THREE.Color(color);
  return true;
}

function setPosition ({light , position}){
  light.position.x = position.x;
  light.position.y = position.y;
  light.position.z = position.z;
}

function setGeneralProperties ({light , targetPosition , castShadow , shadowMapDarkness , 
  shadowMapSizeWidth , shadowMapSizeHeight , shadowCameraNear , shadowCameraFar , skyColor , groundColor , distance , width , height}){
    if(lightType == "spot" || lightType == "directional" || lightType == "point"){
      light.castShadow = castShadow ;
      light.shadowMapDarkness = shadowMapDarkness;
      light.shadow.mapSize.width = shadowMapSizeWidth; 
      light.shadow.mapSize.height = shadowMapSizeHeight;
      light.shadow.camera.near = shadowCameraNear;
      light.shadow.camera.far = shadowCameraFar;
    }

    if (lightType == "directional"){
      light.target.position.x = targetPosition.x;
      light.target.position.y = targetPosition.y;
      light.target.position.z = targetPosition.z;

    }

    if (lightType == "hemisphere"){
      light.skyColor = new THREE.Color(skyColor);
      light.groundColor = new THREE.Color(groundColor);
    }
    
    if (lightType == "point" || lightType == "spot"){
      light.distance = distance;
    }

    if (lightType == "rectangular"){
      light.width = width;
      light.height = height;
      light.lookAt(targetPosition);
    }

    return true;
}

function light ({lightType}){
  let result;
  switch(lightType){
    case "ambient":
      result = new THREE.AmbientLight (color, intensity);
      break;
    case "spot":
      result = new THREE.SpotLight(color , intensity);
      break;
    case "directional":
      result = new THREE.DirectionalLight( color, intensity );
      break;
    case "hemisphere":
      result = new THREE.HemisphereLight( skyColor, groundColor, intensity );
      break;
    case "point":
      result = new THREE.PointLight( color, intensity, distance );
      break;
    case "rectangular":
      // it needs to include RectAreaLightUniformsLib.js
      result = new THREE.RectAreaLight( color, intensity,  width, height );
      let rectLightHelper = new THREE.RectAreaLightHelper( result );
      result.add( rectLightHelper );
      break;
  }


  return result;
}

function needsUpdate ({light , visible }){
    if (visible && needsUpdate!=light){
      three.scene.add(light);
    }
    if (!visible && needsUpdate==light){
      three.scene.remove(light);
    }
}