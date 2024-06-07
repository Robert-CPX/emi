'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { createVRMAnimationClip, VRMAnimationLoaderPlugin, VRMLookAtQuaternionProxy } from '@pixiv/three-vrm-animation';
import { useEmi } from '@/context/EmiProvider';
import { getAnimation } from '@/lib/utils';
import { EMI_RESOURCES, EMI_ANIMATIONS, EMI_CLICK_AREA } from '@/constants/constants';

import { playSound } from "@/lib/utils"
import { AUDIO_RESOURCES } from "@/constants/constants"

interface EmiProps {
  isNewUser: boolean;
  isTodayFirstEnter: boolean;
}

const Emi = (props: EmiProps) => {
  const { isNewUser, isTodayFirstEnter } = props;
  const mountRef = useRef<HTMLDivElement>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const vrmRef = useRef<any>(null); // Use a more specific type for your VRM model
  const gltfLoaderRef = useRef<GLTFLoader>(new GLTFLoader());  // Ref for GLTFLoader
  const mainAnimationRef = useRef<THREE.AnimationAction | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const { mode, emotion, isSpeaking } = useEmi();

  const speakAnimationRef = useRef<THREE.AnimationAction | null>(null);

  const uninterruptibleRef = useRef<boolean>(false); // if is playing an uninterruptible animation

  // scene objects
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // constants
  const focusModeCameraPositionRef = useRef<[number, number, number]>([0, 1.3, 2.4]);
  const focusModeCameraTargetRef = useRef<[number, number, number]>([0, 0.5, 0]);
  const companionModeCameraPositionRef = useRef<[number, number, number]>([0, 1.5, 2.4]);
  const companionModeCameraTargetRef = useRef<[number, number, number]>([0, 1.2, 0]);
  const focusLayerIdxRef = useRef<number>(1);

  useEffect(() => {
    console.log("isNewUser: ", isNewUser, "isTodayFirstEnter: ", isTodayFirstEnter)
  }, [isNewUser, isTodayFirstEnter])

  useEffect(() => {
    if (!mode) return;
    console.log(mode);

    if (mode === "focus") {
      cameraRef.current?.layers.enable(1);
      cameraRef.current?.position.set(...focusModeCameraPositionRef.current);
      controlsRef.current?.target.set(...focusModeCameraTargetRef.current);
      uninterruptibleRef.current = false;
      loadAndPlayAnimation(EMI_ANIMATIONS.WRITING.idle, true, 0.3);
      uninterruptibleRef.current = true;
    } else if (mode === "companion") {
      cameraRef.current?.layers.disable(1);
      cameraRef.current?.position.set(...companionModeCameraPositionRef.current);
      controlsRef.current?.target.set(...companionModeCameraTargetRef.current);
      uninterruptibleRef.current = false;
      loadAndPlayAnimation(EMI_ANIMATIONS.DEFAULT.idle, true, 0.3);
    }
  }, [mode]);

  useEffect(() => {
    if (!emotion) return;
    const animation = getAnimation(emotion);
    console.log("Current Emotion: " + emotion.behavior.code)

    if (!mixerRef.current) {
      throw new Error('mixerRef.current is not found.');
    }

    // play random gesture if there is one
    if (animation.gestures.length > 0) {
      const randIdx = Math.floor(Math.random() * animation.gestures.length);
      loadAndPlayAnimation(animation.gestures[randIdx], false);
      const onFinished = () => {
        if (!mixerRef.current) return; // Check for null
        mixerRef.current.removeEventListener('finished', onFinished); // Clean up the listener
        loadAndPlayAnimation(animation.idle); // Play idle animation in loop
      };
      mixerRef.current.addEventListener('finished', onFinished);
    } else {
      loadAndPlayAnimation(animation.idle);
    }
  }, [emotion]);

  useEffect(() => {
    if (isSpeaking) {
      speakAnimationRef.current?.play();
    } else {
      speakAnimationRef.current?.stop();
    }
  }, [isSpeaking]);

  useEffect(() => {
    const scene = new THREE.Scene();

    // load background image
    const loader = new THREE.TextureLoader();
    loader.load(EMI_RESOURCES.background, function (texture) {
      texture.minFilter = THREE.LinearFilter;
      scene.background = texture;
    });

    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);
    camera.position.set(...companionModeCameraPositionRef.current);
    renderer.setClearColor(0x99ddff);
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.target.set(...companionModeCameraTargetRef.current);
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
      clockRef.current = new THREE.Clock();

      loadAndPlayAnimation(EMI_ANIMATIONS.DEFAULT.idle);

      //setup speak animation
      const speak_interval = 0
      const speakTrack = new THREE.NumberKeyframeTrack(
        vrmRef.current.expressionManager.getExpressionTrackName('aa'), // name
        [0.0, 0.2, 0.4, speak_interval], // times
        [0.0, 0.3, 0.0, 0.0] // values
      );
      const clip = new THREE.AnimationClip('Animation', 0.4 + speak_interval, [speakTrack]);
      speakAnimationRef.current = mixerRef.current?.clipAction(clip)

      async function loadModel(resource: string, layer: number = 0): Promise<THREE.Group> {
        const gltf = await gltfLoaderRef.current.loadAsync(resource);
        const model = gltf.scene;
        model.traverse((object: THREE.Object3D) => object.layers.set(layer));
        scene.add(model);
        return model;
      }

      //load pencil
      const pencil = await loadModel(EMI_RESOURCES.pencil, focusLayerIdxRef.current);
      const boneToAttachTo = vrm.humanoid.getNormalizedBoneNode('rightThumbDistal');
      boneToAttachTo.add(pencil);
      const relativeOffsetPosition = new THREE.Vector3(0, -0.022, -0.0044);
      const relativeOffsetRotation = new THREE.Euler(-0.34, -1, 0.63, 'XYZ');
      pencil.rotation.setFromVector3(relativeOffsetRotation as any);
      pencil.position.copy(relativeOffsetPosition);
      boneToAttachTo.updateMatrixWorld(true);

      await loadModel(EMI_RESOURCES.chair, focusLayerIdxRef.current);
      await loadModel(EMI_RESOURCES.desk, focusLayerIdxRef.current);
      await loadModel(EMI_RESOURCES.tableTop, focusLayerIdxRef.current);

      const animate = () => {
        const deltaTime = clockRef.current?.getDelta();
        if (deltaTime) {
          mixerRef.current?.update(deltaTime);
          vrm.update(deltaTime);
        }
        renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(animate);
    };

    initVRMScene();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // setup listener for click events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      if (uninterruptibleRef.current) return;
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections
      const intersects = raycaster.intersectObject(vrmRef.current.scene, true);

      if (intersects.length > 0) {
        playSound(AUDIO_RESOURCES.CLICK_CHARACTER_SOUND);
        handleBodyPartClick(intersects[0].object);
      }
    };

    window.addEventListener('click', onMouseClick, false);

    const handleBodyPartClick = (object: THREE.Object3D) => {
      let animation = undefined;
      for (const area in EMI_CLICK_AREA) {
        if (EMI_CLICK_AREA[area].meshes.includes(object.name)) {
          animation = EMI_CLICK_AREA[area].animation;
        }
      }
      if (!animation) {
        animation = EMI_CLICK_AREA.OTHER.animation;
      }

      const onFinished = () => {
        if (!mixerRef.current) return; // Check for null
        mixerRef.current.removeEventListener('finished', onFinished); // Clean up the listener
        uninterruptibleRef.current = false;
        loadAndPlayAnimation(EMI_ANIMATIONS.DEFENSIVENESS.idle); // Play idle animation in loop
      };
      mixerRef.current?.addEventListener('finished', onFinished);
      loadAndPlayAnimation(animation, false)
      uninterruptibleRef.current = true;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener('click', onMouseClick, false);
    };
  }, []);

  const loadAndPlayAnimation = async (filename: string, shouldLoop = true, fadeDuration = 0.5) => {
    if (uninterruptibleRef.current) return;
    const fullPath = EMI_RESOURCES.emotionPath + filename;
    console.log("playing animation " + fullPath);
    if (!mixerRef.current) return;

    const gltfVrma = await gltfLoaderRef.current.loadAsync(fullPath);
    const vrmAnimation = gltfVrma.userData.vrmAnimations[0];
    const clip = createVRMAnimationClip(vrmAnimation, vrmRef.current);

    // Create a new action for the new animation clip
    const newAction = mixerRef.current?.clipAction(clip);
    newAction.clampWhenFinished = true;
    newAction.loop = shouldLoop ? THREE.LoopRepeat : THREE.LoopOnce;

    // If there's a currently active action, fade it out
    if (mainAnimationRef.current) {
      newAction.weight = 1;
      // Start playing the new action first
      newAction.play();
      // Use crossFadeTo to transition from the current action to the new action
      mainAnimationRef.current.crossFadeTo(newAction, fadeDuration, true);
    } else {
      newAction.play();
    }
    mainAnimationRef.current = newAction;
  };

  return <div ref={mountRef} />;
};

export default Emi;
