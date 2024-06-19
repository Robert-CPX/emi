'use client'

import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { createVRMAnimationClip, VRMAnimationLoaderPlugin, VRMLookAtQuaternionProxy } from '@pixiv/three-vrm-animation';
import { useEmi } from '@/context/EmiProvider';
import { getAnimation } from '@/lib/utils';
import { EMI_RESOURCES, EMI_ANIMATIONS, EMI_CLICK_AREA, EMI_MATERIAL_NAME } from '@/constants/constants';

import { playSound, SoundControl } from "@/lib/utils"
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
  const { mode, emotion, isSpeaking, goalCreated, setIsSpeaking, setGoalCreated,
    focusFinished, setFocusFinished, hasGreeted, setHasGreeted
   } = useEmi();

  const speakAnimationRef = useRef<THREE.AnimationAction | null>(null);
  const blinkAnimationRef = useRef<THREE.AnimationAction | null>(null);

  const idleAnimationFileNameRef  = useRef<string | null>(null);
  const lastPlayedGestureRef   = useRef<THREE.AnimationAction | null>(null);

  const [initFinished, setInitFinished] = useState(false)
  const soundRef = useRef<SoundControl|undefined>(undefined)
  const [lastInteractionTime, setLastInteractionTime] = React.useState(Date.now());
  const idleTime = 10000;
  const canClickRef = useRef<boolean>(true);
  const canPlayIdleAnimRef = useRef<boolean>(true);
  const isModeFirstUpdate = useRef<boolean>(true);

  // scene objects
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const backgroundTextureRef = useRef<THREE.Texture | null>(null);
  // constants
  const focusModeCameraPositionRef = useRef<[number, number, number]>([0, 1.3, 2.4]);
  const focusModeCameraTargetRef = useRef<[number, number, number]>([0, 0.5, 0]);
  const companionModeCameraPositionRef = useRef<[number, number, number]>([0, 1.5, 2.4]);
  const companionModeCameraTargetRef = useRef<[number, number, number]>([0, 1.2, 0]);
  const focusLayerIdxRef = useRef<number>(1);

  const matparams = {
    shadingToonyFactor: 0.65,
    shadingShiftFactor: -0.2,
  
    shadeColorFactorR: 1,
    shadeColorFactorG: 1,
    shadeColorFactorB: 1,
  
    parametricRimColorFactorR: 0.453,
    parametricRimColorFactorG: 0.237,
    parametricRimColorFactorB: 0.113,
  
    parametricRimFresnelPowerFactor: 18.6,
    parametricRimLiftFactor: 0.3,
    rimLightingMixFactor: 0.3,
  
    skinOutlineColorFactorR: 0.663,
    skinOutlineColorFactorG: 0.193,
    skinOutlineColorFactorB: 0.149,
  };

  // for playing focus finished animations
  // TODO refactor repeated code
  useEffect(() => {
    if (!focusFinished || !initFinished) return;
    const onFinishFocusReaction = () => {
      setFocusFinished(false);
      loadAndPlayAnimation({filename: EMI_ANIMATIONS.JOY.idle, animationType:AnimationType.Idle});
    };
    
    loadAndPlayAnimation({filename: EMI_ANIMATIONS.LOGIN.idle, animationType: AnimationType.Gesture, soundFile: AUDIO_RESOURCES.FOCUS_FINISH, override:true, 
      onFinish: onFinishFocusReaction });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusFinished, initFinished])

  // for playing goal created animations
  useEffect(() => {
    if (!goalCreated || !initFinished) return;
    const onFinishGoalReaction = () => {
      setGoalCreated(false);
    };
    
    loadAndPlayAnimation({filename: EMI_ANIMATIONS.LOGIN.idle, animationType: AnimationType.Gesture, soundFile: AUDIO_RESOURCES.GOAL_CREATED, override:true, 
      onFinish: onFinishGoalReaction });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalCreated, initFinished])

  // for playing login animations
  useEffect(() => {
    if (hasGreeted || !initFinished) return;
    const onFinishGreet = () => {
      setHasGreeted(true);
      loadAndPlayAnimation({filename: EMI_ANIMATIONS.JOY.idle, animationType:AnimationType.Idle});
    };
    
    if(isNewUser){
      loadAndPlayAnimation({filename: EMI_ANIMATIONS.INTRO.idle, animationType: AnimationType.Gesture, soundFile: AUDIO_RESOURCES.ONBOARDING_DIALOGUE,
        onFinish: onFinishGreet });
    } else if(isTodayFirstEnter){
      loadAndPlayAnimation({filename: EMI_ANIMATIONS.LOGIN.idle, animationType: AnimationType.Gesture, soundFile: AUDIO_RESOURCES.LOGIN_FIRST, 
        onFinish: onFinishGreet });
    } else {
      loadAndPlayAnimation({filename: EMI_ANIMATIONS.LOGIN.idle, animationType: AnimationType.Gesture, soundFile: AUDIO_RESOURCES.LOGIN, 
        onFinish: onFinishGreet });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewUser, isTodayFirstEnter, initFinished])

  // for playing idle animations
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteractionTime >= idleTime) {
        const randIdx = Math.floor(Math.random() * EMI_ANIMATIONS.IDLE.gestures.length);
        if (canPlayIdleAnimRef.current) {
          loadAndPlayAnimation({filename: EMI_ANIMATIONS.IDLE.gestures[randIdx], animationType: AnimationType.Gesture});
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastInteractionTime]);

  // for changing modes
  useEffect(() => {
    if (!mode || !initFinished) return;
    if (isModeFirstUpdate.current) { // prevent mode update on page load from overriding greet animations
      isModeFirstUpdate.current = false;
      return;
    }
    if (mode === "focus") {
      cameraRef.current?.layers.enable(1);
      cameraRef.current?.position.set(...focusModeCameraPositionRef.current);
      controlsRef.current?.target.set(...focusModeCameraTargetRef.current);
      loadAndPlayAnimation({filename:EMI_ANIMATIONS.WRITING.idle, animationType: AnimationType.Idle, fadeDuration: 0.3, override: true});
      canClickRef.current = false;
      canPlayIdleAnimRef.current = false;
    } else if (mode === "companion") {
      cameraRef.current?.layers.disable(1);
      cameraRef.current?.position.set(...companionModeCameraPositionRef.current);
      controlsRef.current?.target.set(...companionModeCameraTargetRef.current);
      loadAndPlayAnimation({filename:EMI_ANIMATIONS.DEFAULT.idle, animationType: AnimationType.Idle, fadeDuration: 0.3, override: true});
      canClickRef.current = true;
      canPlayIdleAnimRef.current = true;
    }
    // return () => {
    //   isModeFirstUpdate.current = true
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initFinished]);

  // for changing emotions
  useEffect(() => {
    if (!emotion) return;
    const animation = getAnimation(emotion);

    // play random gesture if there is one
    if (animation.gestures.length > 0) {
      const randIdx = Math.floor(Math.random() * animation.gestures.length);
      loadAndPlayAnimation({filename: animation.gestures[randIdx], animationType: AnimationType.Gesture,
        onFinish: () => loadAndPlayAnimation({filename: animation.idle, animationType:AnimationType.Idle})
      });
    } else {
      loadAndPlayAnimation({filename: animation.idle, animationType: AnimationType.Idle});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotion]);

  // for speak animation
  useEffect(() => {
    if (isSpeaking) {
      speakAnimationRef.current?.play();
    } else {
      speakAnimationRef.current?.stop();
    }
  }, [isSpeaking]);

  // Initialization
  useEffect(() => {
    const scene = new THREE.Scene();

    // load background image
    const loader = new THREE.TextureLoader();
    loader.load(EMI_RESOURCES.background, function(texture) {
      texture.minFilter = THREE.LinearFilter;
      scene.background = texture;
      backgroundTextureRef.current = texture;
      updateBackground();
    });
  
    function updateBackground(): void {
      // When factor larger than 1, that means texture 'wilder' than target。 
      // we should scale texture height to target height and then 'map' the center  of texture to target， and vice versa.
      const targetAspect =  window.innerWidth / window.innerHeight;
      const imageAspect = backgroundTextureRef.current?.image.width  / backgroundTextureRef.current?.image.height;
      const factor = imageAspect / targetAspect;
      if (scene.background  instanceof THREE.Texture){
        scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
        scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
        scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
        scene.background.repeat.y = factor > 1 ? 1 : factor;
      }
    }

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

      // override material properties
      const mtoonMaterials = gltfVrm.userData.vrmMToonMaterials;

      for ( const material of mtoonMaterials ) {
        if (material.name == EMI_MATERIAL_NAME.FACE){
          material.uniforms.shadingToonyFactor.value = matparams.shadingToonyFactor;
        }
        else if (material.name == EMI_MATERIAL_NAME.HAIR){
          material.uniforms.shadingToonyFactor.value = matparams.shadingToonyFactor;
          material.uniforms.shadingShiftFactor.value = matparams.shadingShiftFactor;
      
          material.uniforms.parametricRimColorFactor.value.r = matparams.parametricRimColorFactorR;
          material.uniforms.parametricRimColorFactor.value.g = matparams.parametricRimColorFactorG;
          material.uniforms.parametricRimColorFactor.value.b = matparams.parametricRimColorFactorB;
      
      
          material.uniforms.shadeColorFactor.value.r = matparams.shadeColorFactorR;
          material.uniforms.shadeColorFactor.value.g = matparams.shadeColorFactorG;
          material.uniforms.shadeColorFactor.value.b = matparams.shadeColorFactorB;
      
          material.uniforms.parametricRimFresnelPowerFactor.value = matparams.parametricRimFresnelPowerFactor;
          material.uniforms.parametricRimLiftFactor.value = matparams.parametricRimLiftFactor;
          material.uniforms.rimLightingMixFactor.value = matparams.rimLightingMixFactor;
        }
        else if (material.name == EMI_MATERIAL_NAME.FACE_OUTLINE){
          material.uniforms.outlineColorFactor.value.r = matparams.skinOutlineColorFactorR;
          material.uniforms.outlineColorFactor.value.g = matparams.skinOutlineColorFactorG;
          material.uniforms.outlineColorFactor.value.b = matparams.skinOutlineColorFactorB;
        }
        else if (material.name == EMI_MATERIAL_NAME.BODY){
          material.uniforms.shadingToonyFactor.value = matparams.shadingToonyFactor;
          material.uniforms.shadingShiftFactor.value = matparams.shadingShiftFactor;
        }
        else if (material.name == EMI_MATERIAL_NAME.CLOTHES){
          material.uniforms.shadingToonyFactor.value = matparams.shadingToonyFactor;
          material.uniforms.shadingShiftFactor.value = matparams.shadingShiftFactor;
        }
        else if (material.name == EMI_MATERIAL_NAME.SKIRT){
          material.uniforms.shadingToonyFactor.value = matparams.shadingToonyFactor;
          material.uniforms.shadingShiftFactor.value = matparams.shadingShiftFactor;
        }
        else if (material.name == EMI_MATERIAL_NAME.BODY_OUTLINE){
          material.uniforms.outlineColorFactor.value.r = matparams.skinOutlineColorFactorR;
          material.uniforms.outlineColorFactor.value.g = matparams.skinOutlineColorFactorG;
          material.uniforms.outlineColorFactor.value.b = matparams.skinOutlineColorFactorB;
        }
      }

      //setup speak animation
      const speak_interval = 0
      const speakTrack = new THREE.NumberKeyframeTrack(
        vrmRef.current.expressionManager.getExpressionTrackName('aa'), // name
        [0.0, 0.2, 0.4, speak_interval], // times
        [0.0, 0.3, 0.0, 0.0] // values
      );
      let clip = new THREE.AnimationClip( 'Animation', 0.4 + speak_interval, [ speakTrack ] );
      speakAnimationRef.current = mixerRef.current?.clipAction( clip )

      const blinkInterval = 2 
      const blinkTrack = new THREE.NumberKeyframeTrack(
        vrm.expressionManager.getExpressionTrackName( 'blink' ), // name
        [ 0.0, 0.05, 0.1,  blinkInterval], // times
        [ 0.0, 1.0, 0.0, 0 ] // values
      );
      clip = new THREE.AnimationClip( 'Animation', 0.1 + blinkInterval, [ blinkTrack ] );
      blinkAnimationRef.current = mixerRef.current?.clipAction( clip )
      blinkAnimationRef.current?.play();

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
      setInitFinished(true);
    };

    const handleResize = () => {
      updateBackground();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // setup listener for click events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      // detect if mouse click is on canvas
      const validElements = document.querySelectorAll('#emi-canvas');
      const validElementsArray = Array.from(validElements);
      const targetElement = event.target as Element;
      // console.log(targetElement)
      if (targetElement && !validElementsArray.includes(targetElement)) return

      if (!canClickRef.current || lastPlayedGestureRef.current?.isRunning()) return;
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
      let voiceline = undefined;
      for (const area in EMI_CLICK_AREA) {
        if (EMI_CLICK_AREA[area].meshes.includes(object.name)) {
          animation = EMI_CLICK_AREA[area].animation;
          voiceline = EMI_CLICK_AREA[area].voiceline;
        }
      }
      if (!animation || ! voiceline){
        animation = EMI_CLICK_AREA.OTHER.animation;
        voiceline = EMI_CLICK_AREA.OTHER.voiceline;
      }
        loadAndPlayAnimation({filename: animation, animationType:AnimationType.Gesture, soundFile: voiceline})
    }

    initVRMScene();

    return () => {
      window.removeEventListener('resize', handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener('click', onMouseClick, false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  enum AnimationType {
    Idle, // idle animations are looped and resumes playing after a gesture animation is finished
    Gesture // gesture animations only plays once
  }

  type LoadAndPlayAnimationParams = {
    filename: string; 
    animationType: AnimationType;
    fadeDuration?: number;
    override?: boolean; // if should override the current animation
    soundFile?: string;
    onFinish?: Function;
  };

  const loadAndPlayAnimation = async ({
    filename,
    animationType,
    fadeDuration = 0.5,
    override = false,
    soundFile = undefined,
    onFinish
  }: LoadAndPlayAnimationParams)  => {
    // check if is overriding a gesture
    if (!override && lastPlayedGestureRef.current && lastPlayedGestureRef.current.isRunning()) return;
    
    if (soundRef.current && animationType == AnimationType.Gesture){
      soundRef.current.stop();
    }
    setLastInteractionTime(Date.now());

    const fullPath = EMI_RESOURCES.emotionPath + filename;
    console.log("playing animation " + fullPath);
    if (!mixerRef.current) {
      throw new Error('mixerRef.current is not found.');
    }

    const gltfVrma = await gltfLoaderRef.current.loadAsync(fullPath);
    const vrmAnimation = gltfVrma.userData.vrmAnimations[0];
    const clip = createVRMAnimationClip(vrmAnimation, vrmRef.current);

    // Create a new action for the new animation clip
    const newAction = mixerRef.current?.clipAction(clip);
    newAction.clampWhenFinished = true;

    // to transition from gesture back to idle
    const onAnimationFinish = () => {
      mixerRef.current?.removeEventListener('finished', onAnimationFinish); // Clean up the listener
      if (idleAnimationFileNameRef.current){
        loadAndPlayAnimation({filename: idleAnimationFileNameRef.current, animationType: AnimationType.Idle}); // resume idle animation
      }
      if (onFinish){
        onFinish();
      }
    };
    
    // set up animation based on type
    if (animationType == AnimationType.Idle){
      idleAnimationFileNameRef.current = filename;
      newAction.loop = THREE.LoopRepeat;
    } else if (animationType == AnimationType.Gesture){
      // stop previous animation sound
      lastPlayedGestureRef.current = newAction;
      newAction.loop = THREE.LoopOnce;
      mixerRef.current?.addEventListener('finished', onAnimationFinish);
    }

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

    

    // handle sound file
    if (soundFile){
      setIsSpeaking(true);
      soundRef.current = playSound(soundFile, () => setIsSpeaking(false));
    }
    
  };
  
  return <div ref={mountRef} />;
};

export default Emi;
