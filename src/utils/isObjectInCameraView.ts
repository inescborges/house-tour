import * as THREE from "three";

const _frustum = new THREE.Frustum();
const _projScreenMatrix = new THREE.Matrix4();

export function isObjectInCameraView(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D
) {
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  _projScreenMatrix.multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );

  _frustum.setFromProjectionMatrix(_projScreenMatrix);

  return _frustum.intersectsObject(object);
}
