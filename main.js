import {loadGLTF, loadVideo} from "./libs/loader.js";
import {createChromaMaterial} from "./libs/chroma-video.js";


const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.querySelector("#container"),
      imageTargetSrc: './assets/Kittens_Target.mind',
      uiScanning: "#scanning",
    });
    
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // 3d object
    const gltf = await loadGLTF('./assets/Snowflakes.glb');
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.set(0, -0.2, 0.3);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);

    //video1
    const video1 = await loadVideo("./assets/Kittens_Cropped.mp4");
    video1.setAttribute('loop', true);
    const v1texture = new THREE.VideoTexture(video1);

    const v1geometry = new THREE.PlaneGeometry(1, 1);
    const v1material = createChromaMaterial(v1texture, 0x00ff00);
    const v1plane = new THREE.Mesh(v1geometry,v1material);
    v1plane.position.set(0,0,0);
    anchor.group.add(v1plane);
  
    
anchor.onTargetFound = () =>{
  video1.play();
}
anchor.onTargetLost = () => {
  video1.pause();
}


const mixer = new THREE.AnimationMixer(gltf.scene);
const action = mixer.clipAction(gltf.animations[0]);
action.play();

const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta =clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});



