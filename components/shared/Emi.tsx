'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { createVRMAnimationClip, VRMAnimationLoaderPlugin, VRMLookAtQuaternionProxy } from '@pixiv/three-vrm-animation';
import { useEmi } from '@/context/EmiProvider';
import { getAnimation } from '@/lib/utils';
import { EMI_RESOURCES, EMI_ANIMATIONS } from '@/constants/constants';

const Emi = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const vrmRef = useRef<any>(null); // Use a more specific type for your VRM model
  const gltfLoaderRef = useRef<GLTFLoader>(new GLTFLoader());  // Ref for GLTFLoader
  const mainAnimationRef = useRef<THREE.AnimationAction | null>(null);
  const { emotion } = useEmi();

  useEffect(() => {
    if (!emotion) return;
    const animation = getAnimation(emotion);
    loadAndPlayAnimation(animation);
  }, [emotion]);

  useEffect(() => {
    const scene = new THREE.Scene();

    // load background image
    const loader = new THREE.TextureLoader();
    loader.load(EMI_RESOURCES.background, function (texture) {
      texture.minFilter = THREE.LinearFilter;
      scene.background = texture;
    });

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);
    camera.position.set(0, 1.5, 1.4);
    renderer.setClearColor(0x99ddff);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(0, 5, 3);
    scene.add(directionalLight);

    gltfLoaderRef.current.register((parser) => new VRMLoaderPlugin(parser));
    gltfLoaderRef.current.register((parser) => new VRMAnimationLoaderPlugin(parser));

    const initVRMScene = async () => {
      const gltfVrm = await gltfLoaderRef.current.loadAsync(EMI_RESOURCES.character);
      const vrm = gltfVrm.userData.vrm;
      vrmRef.current = vrm; // Store the VRM for future reference
      VRMUtils.rotateVRM0(vrm);
      VRMUtils.removeUnnecessaryVertices(vrm.scene);
      VRMUtils.removeUnnecessaryJoints(vrm.scene);
      vrm.scene.traverse((obj: THREE.Object3D) => obj.frustumCulled = false);
      const lookAtQuatProxy = new VRMLookAtQuaternionProxy(vrm.lookAt);
      lookAtQuatProxy.name = 'lookAtQuaternionProxy';
      vrm.scene.add(lookAtQuatProxy);
      const lookAtTarget = new THREE.Object3D();
      camera.add(lookAtTarget);
      vrm.lookAt.target = lookAtTarget;
      scene.add(vrm.scene);

      mixerRef.current = new THREE.AnimationMixer(vrm.scene);
      const clock = new THREE.Clock();

      // Load and play the intro animation immediately after the VRM is loaded
      const gltfVrma = await gltfLoaderRef.current.loadAsync(EMI_RESOURCES.emotionPath + EMI_ANIMATIONS.DEFAULT);
      const vrmAnimation = gltfVrma.userData.vrmAnimations[0];
      const introClip = createVRMAnimationClip(vrmAnimation, vrm);
      mainAnimationRef.current = mixerRef.current.clipAction(introClip);
      mainAnimationRef.current.play();

      //load pencil
      const gltfPencil = await gltfLoaderRef.current.loadAsync(EMI_RESOURCES.pencil);
      const pencil = gltfPencil.scene;
      scene.add(pencil);
      const boneToAttachTo = vrm.humanoid.getBoneNode('rightThumbDistal');
      boneToAttachTo.add(pencil);
      const relativeOffsetPosition = new THREE.Vector3(0, -0.02, 0.01);
      const relativeOffsetRotation = new THREE.Euler(Math.PI / 4, 0, 0, 'XYZ');
      pencil.rotation.setFromVector3(relativeOffsetRotation as any);
      pencil.position.copy(relativeOffsetPosition);
      boneToAttachTo.updateMatrixWorld(true);

      // load chair
      const gltfChair = await gltfLoaderRef.current.loadAsync(EMI_RESOURCES.chair);
      scene.add(gltfChair.scene);

      // load desk
      const gltfDesk = await gltfLoaderRef.current.loadAsync(EMI_RESOURCES.desk);
      scene.add(gltfDesk.scene);

      // load table top items
      const gltfTableTopItems = await gltfLoaderRef.current.loadAsync(EMI_RESOURCES.tableTop);
      scene.add(gltfTableTopItems.scene);

      const animate = () => {
        requestAnimationFrame(animate);
        const deltaTime = clock.getDelta();
        mixerRef.current?.update(deltaTime);
        vrm.update(deltaTime);
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      };
      animate();
    };

    initVRMScene();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const loadAndPlayAnimation = async (filename: string) => {
    const fullPath = EMI_RESOURCES.emotionPath + filename;

    try {
      const gltfVrma = await gltfLoaderRef.current.loadAsync(fullPath);
      const vrmAnimation = gltfVrma.userData.vrmAnimations[0];
      const clip = createVRMAnimationClip(vrmAnimation, vrmRef.current);

      if (mainAnimationRef.current) {
        mainAnimationRef.current.stop();
      }

      if (!mixerRef.current) {
        throw new Error('mixerRef.current is not found.');
      }
      mainAnimationRef.current = mixerRef.current?.clipAction(clip);
      mainAnimationRef.current.play();
    } catch (error) {
      console.error('Failed to load or play the animation:', error);
    }
  };

  return <div ref={mountRef} />;
};

export default Emi;
