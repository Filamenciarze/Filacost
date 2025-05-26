import {Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, viewChild, ElementRef} from '@angular/core';
import {Mesh} from 'three';
import {injectBeforeRender} from 'angular-three';

@Component({
  template: `
    <ngt-mesh #mesh>
      <ngt-box-geometry/>
      <ngt-mesh-basic-material color='darkred'/>
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class SceneGraphComponent {
  meshRef = viewChild.required<ElementRef<Mesh>>('mesh');

  constructor() {
    injectBeforeRender(() => {
      const mesh = this.meshRef().nativeElement;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    })
  }
}
