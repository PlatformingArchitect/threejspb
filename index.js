import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

class App{
    constructor() {
        const divContainer = document.querySelector("#webgl-container");   // id가 webgl-container인 div를 가져와서 divContainer로 저장
        this._divContainer = divContainer;  //다른 method에서도 불러올 수 있도록 this 설정

        const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); 
        //배경 검정으로 하고 aplpha : true로 투명화+css에서 배경 그라디언트
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement); //캔버스 형식의 돔객체
        this._renderer=renderer;
        this._renderer.setSize(window.innerWidth,window.innerHeight);
        


        //collada 로드

        // const loadingManager = new THREE.LoadingManager( function () {
        //     scene.add( object3D );
        // } );

        // const loader = new ColladaLoader();
        // loader.load('TEST2.dae',  function ( collada ) {
        //     const avatar = collada.scene;
        //     scene.add( avatar );
        // } );

        //scene 필드 의
        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupBackground();

        window.onresize = this.resize.bind(this);  //창의 크기가 바뀌면 렌더와 카메라가 다시 잡혀야해서 리사이즈 사용
        this.resize;

        requestAnimationFrame(this.render.bind(this));

    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100
        );

        camera.position.z = 2;
        this._camera = camera;

        this._scene.add(this._camera);
    }


    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
        window.addEventListener('resize',onWindowResize);
        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
          
            renderer.setSize( window.innerWidth, window.innerHeight );
          
          }
    }

    _setupBackground() {
        // 배경색+안개 설정
        // this._scene.background = new THREE.Color("#ffffff");
        // this._scene.fog = new THREE.Fog("#ffffff",20,100);
        // this._scene.fog = new THREE.FogExp2("#ffffff",0.1);

        //그리드 정
        const grid = new THREE.GridHelper( 100, 10, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this._scene.add( grid );
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5,22,4);
        this._scene.add(light);
    }

    _zoomFit(object3D, camera, viewMode, bFront) {
        const box = new THREE.Box3().setFromObject(object3D);
        const sizeBox = box.getSize(new THREE.Vector3()).length();
        const centerBox = box.getCenter(new THREE.Vector3());

        let offsetX = 0, offsetY = 0, offsetZ = 0;
        viewMode === "X" ? offsetX = 1 : (viewMode === "Y") ? 
            offsetY = 1 : offsetZ = 1;
            
        if(!bFront) {
            offsetX *= -1;
            offsetY *= -1;
            offsetZ *= -1;
        }
        camera.position.set(
            centerBox.x + offsetX, centerBox.y + offsetY, centerBox.z + offsetZ);

            const halfSizeModel = sizeBox * 0.5;
        // const halfFov = THREE.Math.degToRad(camera.fov * 0.5);
        const halfFov = camera.fov;
        const distance = halfSizeModel / Math.tan(halfFov);
        const direction = (new THREE.Vector3()).subVectors(
            camera.position, centerBox).normalize();
        const position = direction.multiplyScalar(distance).add(centerBox);

        camera.position.copy(position);
        camera.near = sizeBox / 100;
        camera.far = sizeBox * 100;

        camera.updateProjectionMatrix();

        camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
        // this._controls.target.set(centerBox.x, centerBox.y, centerBox.z);
    }  

    _setupModel() {      
        const loader = new ColladaLoader();
        loader.load('TEST2.dae', object => {
            const loadcollada = object.scene;
            this._scene.add(loadcollada);

            this._zoomFit(loadcollada, this._camera, "X", true);
        } ); 
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth,window.innerHeight);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));  //렌덤 매서드 반복
        
    }

    update(time) {
        time *=0.001;
        // this._cube.rotation.x=time;
        // this._cube.rotation.y=time;
    }
}


window.onload=function() {
    new App();
}
//window.onload : 순서대로 실행되는 프로래밍 작동방식과 충돌하지 않기 위해 항상 마지막에 실행 되도록 설정하는 코드