
export function newLight(mainComposite , lightName){
    // defaults
    mainComposite.lights[lightName]={};
    let thisLight = mainComposite.lights[lightName];
    thisLight.color = 0xffffff;
    thisLight.intensity = .5;
    thisLight.visible = true;
    thisLight.position = new THREE.Vector3(0,0,0);
    thisLight.targetPosition = new THREE.Vector3(0,0,0);
    thisLight.castShadow = true ;
    thisLight.shadowMapDarkness = 1;
    thisLight.shadowMapSizeWidth = 2048;  
    thisLight.shadowMapSizeHeight = 2048; 
    thisLight.shadowCameraNear = 0.5;      
    thisLight.shadowCameraFar = 2048;   
    thisLight.skyColor = 0xffffbb;  
    thisLight.groundColor = 0x080820;
    thisLight.distance = 0;
    thisLight.width = 350;
    thisLight.height = 200;

    thisLight.addFunction(light);
    thisLight.addFunction(needsUpdate);
    thisLight.addFunction(setIntensity);
    thisLight.addFunction(setColor);
    thisLight.addFunction(setGeneralProperties);
    thisLight.addFunction(setPosition);

    mainComposite.addLink(mainComposite.three , thisLight.three);


}

const setIntensity = function({light , intensity}){
  light.intensity = intensity;
  return true;
}

const setColor = function({light , color}){
  light.color = new THREE.Color(color);
  return true;
}

const setPosition = function({light , position}){
  light.position.x = position.x;
  light.position.y = position.y;
  light.position.z = position.z;
}


const setGeneralProperties = function({light , targetPosition , castShadow , shadowMapDarkness , 
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



const light = function({lightType}){
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

const needsUpdate = function({light , visible }){
    if (visible && needsUpdate!=light){
      three.scene.add(light);
    }
    if (!visible && needsUpdate==light){
      three.scene.remove(light);
    }
}