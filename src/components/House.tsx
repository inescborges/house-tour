import { useGLTF } from "@react-three/drei";
import type { ComponentPropsWithoutRef } from "react";

export default function House(props: ComponentPropsWithoutRef<"group">) {
  const { scene } = useGLTF("/models/house.glb");

  return <primitive object={scene} {...props} />;
}
