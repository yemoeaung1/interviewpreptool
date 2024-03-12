import React, { useEffect, useRef } from 'react';
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import WhiteHouse from "/WhiteHouse.png"

function Model({ objToRender = 'barack_obama' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Create a Three.JS Scene
    const scene = new THREE.Scene();

    // Create a new camera with positions and angles
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Instantiate a new renderer and set its size
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Load the .gltf file
    const loader = new GLTFLoader();
    loader.load(
      `/barack_obama/scene.gltf`,
      function (gltf) {
        const object = gltf.scene;
        scene.add(object);
        object.scale.set(58,58,58);

        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());

       object.position.x += (object.position.x - center.x);
       object.position.y += (object.position.y - center.y);
       object.position.z += (object.position.z - center.z);

    // Adjust the camera position
    camera.lookAt(center);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
        // Set camera position
    camera.position.z = objToRender === "barack_obama" ? 30 : 100;

    // Add lights
    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // OrbitControls
    let controls;
    // if (objToRender === "barack_obama") {
    //   controls = new OrbitControls(camera, renderer.domElement);
    // }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.onmousemove = null;
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [objToRender]);

  return (<div ref={containerRef} className="model-container" 
  style={{ backgroundImage: `url(${WhiteHouse})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/>);
}

export default Model;