/* eslint-disable react/no-unknown-property */
'use client';
import {useEffect, useRef, useState} from 'react';
import {Canvas, extend, useFrame} from '@react-three/fiber';
import {useGLTF, useTexture, Environment, Lightformer} from '@react-three/drei';
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
    RigidBodyProps
} from '@react-three/rapier';
import {MeshLineGeometry, MeshLineMaterial} from 'meshline';
import * as THREE from 'three';
import clsx from 'clsx';

// replace with your own imports, see the usage snippet for details
import lanyard from './hhg-lanyard.svg';

const cardGLB = '/card.glb';

extend({MeshLineGeometry, MeshLineMaterial});

interface LanyardProps {
    position?: [number, number, number];
    gravity?: [number, number, number];
    fov?: number;
    transparent?: boolean;
    containerClassName?: string;
    cardTextureUrl?: string;
    canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export default function Lanyard({
                                    position = [0, 0, 30],
                                    gravity = [0, -40, 0],
                                    fov = 20,
                                    transparent = true,
                                    containerClassName,
                                    cardTextureUrl,
                                    canvasRef
                                }: LanyardProps) {
    const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

    useEffect(() => {
        const handleResize = (): void => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className={clsx(containerClassName || "relative z-0 w-full h-screen flex justify-center items-center transform scale-100 origin-center")}>
            <Canvas
                ref={canvasRef}
                camera={{position, fov}}
                dpr={[1, isMobile ? 1.5 : 2]}
                gl={{alpha: transparent, preserveDrawingBuffer: true}}
                onCreated={({gl}) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
            >
                <ambientLight intensity={Math.PI}/>
                <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                    <Band isMobile={isMobile} cardTextureUrl={cardTextureUrl}/>
                </Physics>
                <Environment blur={0.75}>
                    <Lightformer
                        intensity={2}
                        color="white"
                        position={[0, -1, 5]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[-1, -1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[1, 1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={10}
                        color="white"
                        position={[-10, 0, 14]}
                        rotation={[0, Math.PI / 2, Math.PI / 3]}
                        scale={[100, 10, 1]}
                    />
                </Environment>
            </Canvas>
        </div>
    );
}

interface BandProps {
    maxSpeed?: number;
    minSpeed?: number;
    isMobile?: boolean;
    cardTextureUrl?: string;
}

function Band({maxSpeed = 50, minSpeed = 0, isMobile = false, cardTextureUrl}: BandProps) {
    const band = useRef<any>(null);
    const fixed = useRef<any>(null);
    const j1 = useRef<any>(null);
    const j2 = useRef<any>(null);
    const j3 = useRef<any>(null);
    const card = useRef<any>(null);

    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const dir = new THREE.Vector3();

    const segmentProps: any = {
        type: 'dynamic' as RigidBodyProps['type'],
        canSleep: true,
        colliders: false,
        angularDamping: 4,
        linearDamping: 4
    };

    const {nodes, materials} = useGLTF(cardGLB) as any;
    const texture = useTexture(typeof lanyard === 'string' ? lanyard : lanyard.src) as THREE.Texture;

    const [customCardTexture, setCustomCardTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
        if (!cardTextureUrl) { setCustomCardTexture(null); return; }
        const loader = new THREE.TextureLoader();
        loader.load(cardTextureUrl, (t) => {
            t.flipY = false;
            t.colorSpace = THREE.SRGBColorSpace;
            setCustomCardTexture(t);
        });
        return () => { customCardTexture?.dispose(); };
    }, [cardTextureUrl]);

    // ── Flip state ─────────────────────────────────────────────────────────
    // We mirror the boolean in a ref so useFrame (a stale closure) always
    // reads the current value without triggering re-renders.
    const isFlippedRef = useRef(false);
    const [isFlipped, setIsFlippedState] = useState(false);
    const toggleFlip = () => {
        const next = !isFlippedRef.current;
        isFlippedRef.current = next;
        setIsFlippedState(next);
    };

    // ── Drag vs tap detection ──────────────────────────────────────────────
    // We only activate physics-drag when the pointer moves > 4px from the
    // initial down position. A quick tap (no movement) skips drag entirely
    // so the card stays dynamic and the torque impulse can act on it.
    const pointerDownScreenXY = useRef<{ x: number; y: number } | null>(null);
    const isDragging = useRef(false);
    const pendingDragVec = useRef<THREE.Vector3 | null>(null);

    const [curve] = useState(
        () => new THREE.CatmullRomCurve3([
            new THREE.Vector3(), new THREE.Vector3(),
            new THREE.Vector3(), new THREE.Vector3()
        ])
    );
    const [dragged, drag] = useState<false | THREE.Vector3>(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => { document.body.style.cursor = 'auto'; };
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        // ── Drag translation ───────────────────────────────────────────────
        if (dragged && typeof dragged !== 'boolean') {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach(r => r.current?.wakeUp());
            card.current?.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z
            });
        }

        if (!fixed.current) return;

        // ── Rope simulation ────────────────────────────────────────────────
        [j1, j2].forEach(ref => {
            if (!ref.current.lerped)
                ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
            const d = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
            ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + d * (maxSpeed - minSpeed)));
        });
        curve.points[0].copy(j3.current.translation());
        curve.points[1].copy(j2.current.lerped);
        curve.points[2].copy(j1.current.lerped);
        curve.points[3].copy(fixed.current.translation());
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));

        // ── Flip steering torque (only when NOT being dragged) ─────────────
        if (!dragged) {
            ang.copy(card.current.angvel());

            // Read current Y rotation via Quaternion → Euler
            const curRot = card.current.rotation();
            const q = new THREE.Quaternion(curRot.x, curRot.y, curRot.z, curRot.w);
            const euler = new THREE.Euler().setFromQuaternion(q, 'YXZ');

            const targetRotY = isFlippedRef.current ? Math.PI : 0;
            let diffY = euler.y - targetRotY;

            // Wrap to shortest path
            while (diffY < -Math.PI) diffY += Math.PI * 2;
            while (diffY > Math.PI)  diffY -= Math.PI * 2;

            // Strong proportional correction + damp existing angular velocity
            card.current.setAngvel({
                x: ang.x * 0.9,
                y: ang.y - diffY * 6,
                z: ang.z * 0.9,
            });
        }
    });

    curve.curveType = 'chordal';
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']}/>
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody
                    position={[2, 0, 0]}
                    ref={card}
                    {...segmentProps}
                    type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
                >
                    <CuboidCollider args={[0.8, 1.125, 0.01]}/>
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerDown={(e: any) => {
                            e.target.setPointerCapture(e.pointerId);
                            // Record screen-space position for tap vs drag detection
                            pointerDownScreenXY.current = { x: e.clientX, y: e.clientY };
                            isDragging.current = false;
                            // Pre-calculate the drag offset but don't commit it yet
                            pendingDragVec.current = new THREE.Vector3()
                                .copy(e.point)
                                .sub(vec.copy(card.current.translation()));
                        }}
                        onPointerMove={(e: any) => {
                            if (!pointerDownScreenXY.current) return;
                            const dx = e.clientX - pointerDownScreenXY.current.x;
                            const dy = e.clientY - pointerDownScreenXY.current.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            // Only activate drag once the pointer has moved > 4px
                            if (!isDragging.current && dist > 4 && pendingDragVec.current) {
                                isDragging.current = true;
                                drag(pendingDragVec.current);
                            }
                        }}
                        onPointerUp={(e: any) => {
                            e.target.releasePointerCapture(e.pointerId);
                            if (isDragging.current) {
                                // End drag normally
                                drag(false);
                            } else {
                                // It was a tap — card is still dynamic, apply torque impulse
                                const next = !isFlippedRef.current;
                                isFlippedRef.current = next;
                                setIsFlippedState(next);
                                // Give it an immediate angular kick so it doesn't wait for useFrame
                                if (card.current) {
                                    card.current.wakeUp();
                                    card.current.applyTorqueImpulse(
                                        { x: 0, y: next ? 5 : -5, z: 0 },
                                        true
                                    );
                                }
                            }
                            pointerDownScreenXY.current = null;
                            isDragging.current = false;
                            pendingDragVec.current = null;
                        }}
                    >
                        <mesh geometry={nodes.card.geometry}>
                            <meshPhysicalMaterial
                                map={cardTextureUrl && customCardTexture ? customCardTexture : materials.base.map}
                                map-anisotropy={16}
                                clearcoat={isMobile ? 0 : 1}
                                clearcoatRoughness={0.15}
                                roughness={0.9}
                                metalness={0.8}
                            />
                        </mesh>
                        <mesh geometry={nodes.clip.geometry}>
                            <meshPhysicalMaterial color="#d8dee5" metalness={1} roughness={0.16} clearcoat={1} clearcoatRoughness={0.12} />
                        </mesh>
                        <mesh geometry={nodes.clamp.geometry}>
                            <meshPhysicalMaterial color="#aeb7c1" metalness={1} roughness={0.2} clearcoat={1} clearcoatRoughness={0.12} />
                        </mesh>
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry/>
                <meshLineMaterial
                    color="white"
                    depthTest={false}
                    resolution={isMobile ? [1000, 2000] : [1000, 1000]}
                    useMap
                    map={texture}
                    repeat={[-4, 1]}
                    lineWidth={1}
                />
            </mesh>
        </>
    );
}

