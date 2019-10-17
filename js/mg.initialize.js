
export function initializeThreeJs(mainComposite){
  let result={};
  // three.js setup
  result.scene = new THREE.Scene ();
  result.renderer = new THREE.WebGLRenderer (); //{devicePixelRatio: 100 }
  result.renderer.shadowMap.enabled = true;
  result.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  result.renderer.setPixelRatio( (window.devicePixelRatio>2)?2:window.devicePixelRatio);
  result.renderer.setSize ( window.innerWidth , window.innerHeight);
  mainComposite.loadedObjects.push(result);

  return result;
}


export const settings = {
  frameRate:60,
  maxSubStep:3
};