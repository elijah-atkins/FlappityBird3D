import { Vector3, AnimationMixer } from '../libs/three.js-r132/build/three.module.js';
import { GLTFLoader } from '../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';

export class Bird {
    constructor(game) {
        this.assetsPath = game.assetsPath;
        this.loadingBar = game.loadingBar;
        this.game = game;
        this.scene = game.scene;
        this.load();
        this.tmpPos = new Vector3();
    }

    get position() {
        if (this.bird !== undefined) {
            this.bird.getWorldPosition(this.tmpPos);
            return this.tmpPos;
        }
    }
    set visible(mode) {
        this.bird.visible = mode;
    }
    load() {
        const loader = new GLTFLoader().setPath(`${this.assetsPath}models/`);
        this.ready = false;

        // Load a glTF resource
        loader.load(
            // resource URL
            'bird.glb',
            // called when the resource is loaded
            gltf => {

                this.scene.add(gltf.scene);
                this.bird = gltf.scene;
                this.velocity = new Vector3(0, 0, 0.1);
                this.mixer = new AnimationMixer(gltf.scene);
                this.action = this.mixer.clipAction(gltf.animations[0]);
                this.action.play();

                this.ready = true;

            },
            // called while loading is progressing
            xhr => {

                this.loadingBar.update('bird', xhr.loaded, xhr.total);

            },
            // called when loading has errors
            err => {

                console.error(err);

            }
        );
    }

    reset() {
        this.bird.position.set(0, 0, 0);
        this.velocity.set(0, 0, 0.1);
        this.bird.visible = true;
    }

    update(time, delta) {
        this.mixer.update(.01);
        this.bird.rotation.z = Math.sin(time * 3) * 0.2;
        if (this.game.active) {
            if (this.game.spaceKey & this.bird.position.y < 10) {
                this.velocity.y += 0.01;
            } else {
                if (this.bird.position.y > -5) {
                    this.velocity.y -= 0.01;
                } else {
                    this.velocity.y += 0.01;
                }
            }
            this.velocity.z += 0.00001;
            this.bird.position.add(this.velocity);

        } else {

            this.mixer.update(.01);

            this.bird.position.y = Math.cos(time) * 1.5;

        }
    }

}
export default Bird;
