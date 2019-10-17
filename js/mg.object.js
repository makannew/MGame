
export function addObject(mainComposite , obj){
  obj.loadedObjects = mainComposite.loadedObjects.getProxyLessObject;
  obj.three = mainComposite.three.getProxyLessObject;

  obj.self = obj;
  obj.mainComposite = mainComposite;
  //obj.quaternion = new THREE.Quaternion();//.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), 0 );
  obj.addFunction(addToLoadedObjects);
  obj.addFunction(addTextureToLoadedObjects);
  // functions
  obj.addFunction(texture);
  obj.addFunction(needsUpdate);
  obj.addFunction(geometry);
  obj.addFunction(material);
  obj.addFunction(mesh);
  obj.addFunction(setScale);
  obj.addFunction(setColor);
  obj.addFunction(mapTexture);
  obj.addFunction(setPosition);
  obj.addFunction(setGeneralProperties);
  obj.addFunction(setShadow);
  obj.addFunction(sceneUpdate);
  obj.addFunction(setQuaternion);
  obj.addFunction(setPlaneHeightField);

  // default values
  if (obj.geometryName == undefined )obj.geometryName = "plane";
  if (obj.materialName == undefined)obj.materialName = "lambert"
  if (obj.color == undefined)obj.color = 0xffffff;
  if (obj.scale == undefined)obj.scale = 1;
  if (obj.positio == undefined)obj.position = new THREE.Vector3(0,0,0);
  if (obj.quaternio == undefined)obj.quaternion = new THREE.Quaternion();
  if (obj.visible == undefined)obj.visible = true;
  if (obj.active == undefined)obj.active = true;
  if(obj.widthSegments == undefined)obj.widthSegments =32;
  if(obj.heightSegments == undefined)obj.heightSegments = 32;
  if(obj.radialSegments == undefined)obj.radialSegments = 32;
  if(obj.cylinderHeightSegments == undefined)obj.cylinderHeightSegments = 1;
  if(obj.shininess == undefined)obj.shininess = 30.0;
  if(obj.castShadow == undefined)obj.castShadow =true;
  if(obj.receiveShadow == undefined)obj.receiveShadow =true;
  if(obj.materialIndex == undefined)obj.materialIndex =[0];


}

function addTextureToLoadedObjects({texture}){
  if (addTextureToLoadedObjects) return true;
  mainComposite.loadedObjects.push(texture);
  return true;
}

function addToLoadedObjects({mesh}){
  if (addToLoadedObjects) return true;
  mainComposite.loadedObjects.push(mesh);
  return true;
}

function setPlaneHeightField({mesh,heightData}){
  if (geometryName=="plane"){
    for (let i = 0; i<mesh.geometry.vertices.length; i++ ) {
      mesh.geometry.vertices[i].z = heightData[i];
    }
  }
}
const sceneUpdate = function({mesh , active , three}){
  if (active && sceneUpdate!=mesh){
    three.scene.add(mesh);
    return mesh;
  }
  if (!active && sceneUpdate==mesh){
    three.scene.remove(mesh);
    return false;
  }
}


const needsUpdate = function({mesh , visible}){
  mesh.visible = visible;
  return true;
}

const setGeneralProperties = function({mesh , shininess}){
  if (materialName == "phong"){
    if (material.length==1 && textureFileName===undefined && texture===undefined){
      mesh.material.shininess = shininess;
    }else{
      for (let i=0,len=material.length;i<len;++i){
        mesh.material[i].shininess = shininess;
      }
    }

  }
  
}

const setShadow = function({mesh , castShadow , receiveShadow}){
  mesh.castShadow = castShadow;
  mesh.receiveShadow  = receiveShadow;
}

const setPosition = function({mesh , position}){
  mesh.position.set(position.x,position.y,position.z);
}

const setQuaternion = function({mesh , quaternion}){
  mesh.quaternion.set(quaternion.x,quaternion.y,quaternion.z,quaternion.w);
  return true;
}

const mesh = function({geometry , material , readyToCreateMesh}){
  if (material.length==1 && textureFileName===undefined && texture===undefined){
    return new THREE.Mesh( geometry, material[0]);
  }else{
    return new THREE.Mesh( geometry, material);
  }
}

const material = function({materialName , dimension}){
  let result=[];
  switch (materialName){
    case "lambert":
        result.push(new THREE.MeshLambertMaterial())
      break;
    case "basic":
        result.push(new THREE.MeshBasicMaterial())
      break;
    case "phong":
        result.push(new THREE.MeshPhongMaterial())
      break;
    default:
    console.error(`materialName ${materialName} not found`);
    
  }
  if (textureFileName===undefined && texture===undefined){
     readyToCreateMesh = true;
    }
  return result;
}

const mapTexture = function({texture , material , geometry , materialIndex}){
  for (let i=0,len=texture.length;i<len;++i){
    if (i>=material.length) material.push(material[0].clone());
    material[i].map = texture[i];
  }
  let j = 0;
  switch (geometryName){
    case "plane":
        for (let i=0;i<geometry.faces.length;++i){
          geometry.faces[i].materialIndex = materialIndex[j];
          ++j;
          if (j>=materialIndex.length) j=0;
        }
      break;
    case "box":
      for (let i=0;i<geometry.faces.length;++i){
        geometry.faces[i].materialIndex = materialIndex[j];
        ++j;
        if (j>=materialIndex.length) j=0;
      }
      break;
    case "sphere":
        for (let i=0;i<geometry.faces.length;++i){
          geometry.faces[i].materialIndex = materialIndex[j];
          ++j;
          if (j>=materialIndex.length) j=0;
        }
      break;
    case "cylinder":
        let startRad = dimension.radiusBottom;
        let startRadHalf = startRad/2;
        let endRad = dimension.radiusTop;
        let endRadHalf = endRad/2;
        //let radius_half = dimension.radius/2;
        for (let i=0;i<geometry.faces.length;++i){
          let face = geometry.faces[i];
          let xzAreZero = !face.normal.x && !face.normal.z;
          if (face.normal.y < -.98 && face.normal.y > -1.01 && xzAreZero) {
              geometry.faceVertexUvs[0][i][0].u = (geometry.vertices[face.a].x + startRadHalf) / startRad;
              geometry.faceVertexUvs[0][i][0].v = (geometry.vertices[face.a].z + startRadHalf) / startRad;
              geometry.faceVertexUvs[0][i][1].u = (geometry.vertices[face.b].x + startRadHalf) / startRad;
              geometry.faceVertexUvs[0][i][1].v = (geometry.vertices[face.b].z + startRadHalf) / startRad;
              geometry.faceVertexUvs[0][i][2].u = (geometry.vertices[face.c].x + startRadHalf) / startRad;
              geometry.faceVertexUvs[0][i][2].v = (geometry.vertices[face.c].z + startRadHalf) / startRad;
              face.materialIndex = (materialIndex.length==3)?materialIndex[2]:0;
          } else if (face.normal.y > .98 && face.normal.y < 1.01 && xzAreZero) {
              geometry.faceVertexUvs[0][i][0].u = (geometry.vertices[face.a].x + endRadHalf) / endRad ;
              geometry.faceVertexUvs[0][i][0].v = (geometry.vertices[face.a].z + endRadHalf) / endRad ;
              geometry.faceVertexUvs[0][i][1].u = (geometry.vertices[face.b].x + endRadHalf) / endRad ;
              geometry.faceVertexUvs[0][i][1].v = (geometry.vertices[face.b].z + endRadHalf) / endRad ;
              geometry.faceVertexUvs[0][i][2].u = (geometry.vertices[face.c].x + endRadHalf) / endRad ;
              geometry.faceVertexUvs[0][i][2].v = (geometry.vertices[face.c].z + endRadHalf) / endRad ;
              face.materialIndex = (materialIndex.length==3)?materialIndex[0]:0;
          } else {
            face.materialIndex = (materialIndex.length==3)?materialIndex[1]:0;
          }

        }
      break;
    case "polyhedron":
        for (let i=0;i<geometry.faces.length;++i){
          geometry.faces[i].materialIndex = materialIndex[j];
          ++j;
          if (j>=materialIndex.length) j=0;
        }
    default:
      console.error(`geometryName ${geometryName} not found`);

  }
  readyToCreateMesh = true;
  return true;
}

const geometry = function({geometryName , dimension}){
  let result;
  switch (geometryName){
    case "plane":
      result = new THREE.PlaneGeometry(dimension.length , dimension.width , dimension.xSeg, dimension.Yseg);
      break;
    case "box":
      result = new THREE.BoxGeometry(dimension.length , dimension.width , dimension.height );
      break;
    case "sphere":
      result =new THREE.SphereGeometry( dimension.radius, widthSegments, heightSegments );
      break;
    case "cylinder":
      result = new THREE.CylinderGeometry( dimension.radiusTop, dimension.radiusBottom , 
        dimension.height, radialSegments, cylinderHeightSegments );
      break;
    case "polyhedron":// use basic or lambert material to make sharp edges
      if (!dimension.radius) dimension.radius = 1;
      if (dimension.detail===undefined) dimension.detail = 1;
      result = new THREE.PolyhedronGeometry(dimension.vertices , dimension.faces , dimension.radius , dimension.detail);
      break;
    default:
      console.error(`geometryName ${geometryName} not found`);
  }
  return result;
}

const setScale = function({scale , mesh}){
  mesh.scale.set(scale , scale , scale);
  return true;
}

const setColor = function({color , mesh}){
  if (material.length>0){
      for (let i=0,len=material.length;i<len;++i){
        material[i].color.setHex(color);
      }
  }
  return true;
}

const texture = async function({textureFileName}){
  let result = [];
  let textureFileNameArray = [];
  if (Array.isArray(textureFileName)){
    textureFileNameArray = [...textureFileName];
  }else{
    textureFileNameArray.push(textureFileName);
  }
  for (let i=0,len=textureFileNameArray.length;i<len;++i){
    result.push(await new THREE.TextureLoader().load(textureFileNameArray[i]));
    result[result.length-1].anisotropy = 16

  }
  return result;
}
