import * as THREE from "../build/three.module.js";
import Stats from '../examples/jsm/libs/stats.module.js';
// import { OrbitControls } from "../examples/jsm/controls/OrbitControls";
import { ColladaLoader } from '../examples/jsm/loaders/ColladaLoader.js';

class App{
    constructor() {
        const divContainer = document.querySelector("#webgl-container");   // id가 webgl-container인 div를 가져와서 divContainer로 저장
        this._divContainer = divContainer;  //다른 metho에서도 불러올 수 있도록 this 설정

        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement); //캔버스 형식의 돔객체
        this._renderer=renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();

        window.onresize = this.resize.bind(this);  //창의 크기가 바뀌며 렌더와 카메라가 다시 잡혀야해서 리사이즈 사용
        this.resize;

        requestAnimationFrame(this.render.bind(this));

    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width/height,
            0.1,
            100
        );
        camera.position.z=2;
        this._camera=camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    _setupModel() {
        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshPhongMaterial({color: 0x44a88});

        const cube = new THREE.Mesh(geometry,material);

        this._scene.add(cube);  //씬에 큐브 추가
        this._cube=cube;


    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width,height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));  //렌덤 매서드 반복
    }

    update(time) {
        time *=0.001;
        this._cube.rotation.x=time;
        this._cube.rotation.y=time;
    }
}


window.onload=function() {
    new App();
}
//window.onload : 순서대로 실행되는 프로래밍 작동방식과 충돌하지 않기 위해 항상 마지막에 실행 되도록 설정하는 코드