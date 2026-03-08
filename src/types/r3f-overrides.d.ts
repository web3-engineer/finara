/**
 * R3F v9 type overrides.
 *
 * THREE.BufferAttribute has required constructor parameters, which causes R3F v9
 * to require the `args` prop on <bufferAttribute>. This augmentation makes `args`
 * optional so that the old array/count/itemSize prop style also type-checks.
 */

import type * as THREE from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    bufferAttribute: Omit<ThreeElements["bufferAttribute"], "args"> & {
      args?: ConstructorParameters<typeof THREE.BufferAttribute>;
      array?: ArrayLike<number>;
      count?: number;
      itemSize?: number;
      attach?: string;
    };
  }
}
