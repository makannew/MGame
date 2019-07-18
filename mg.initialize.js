
export function initializeThreeJs(){
  let result={};
  // three.js setup
  result.scene = new THREE.Scene ();
  result.renderer = new THREE.WebGLRenderer ();
  result.renderer.shadowMap.enabled = true;
  result.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  result.renderer.setSize ( innerWidth , innerHeight);
  document.body.appendChild ( result.renderer.domElement );
  return result;
}


export const settings = {
  frameRate: 60,
  maxSubStep: 3
};