import {loadVideo} from "./libs/loader.js";
import {createChromaMaterial} from "./libs/chroma-video.js";


const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.querySelector("#container"),
      imageTargetSrc: './assets/Suriname_Target.mind',
      uiScanning: "#scanning",
    });
    
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    
    //video1
    const video1 = await loadVideo("./assets/Suriname_Song.mp4");
    video1.setAttribute('loop', true);
    const v1texture = new THREE.VideoTexture(video1);

    const v1geometry = new THREE.PlaneGeometry(1, 1);
    const v1material = createChromaMaterial(v1texture, 0x00ff00);
    const v1plane = new THREE.Mesh(v1geometry,v1material);
    v1plane.position.set(0,0,0);
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(v1plane);
  
    
anchor.onTargetFound = () =>{
  video1.play();
}
anchor.onTargetLost = () => {
  video1.pause();
}




await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});






