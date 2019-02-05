let GAME = {};
(function (context) {
//  GAME.Scene manage all aspect of the game scene
    context.Scene = function(option={}){
        //default values
        let defaultValues = {
            cameraFocalLenght : option["cameraFocalLenght"] || 50,
            cameraNearView : option["cameraNearView"] || 0.1,
            cameraFarView : option["cameraFarView"] || 10000
        };
        let lastTime = undefined;
        let dt = 0; // time deference between two update calls
        //properties
        // I have to setup a mechanism for calculating realtime framerate and dynamically set maximum framerate upon hardware capabilities
        this.frameRate = 120;
        //
        //three.js setup
        this.threeScene = new THREE.Scene ();
        this.threeCamera = new THREE.PerspectiveCamera ( defaultValues.cameraFocalLenght , 
            window.innerWidth / window.innerHeight , 
            defaultValues.cameraNearView , defaultValues.cameraFarView);
        let renderer = new THREE.WebGLRenderer ();
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize ( window.innerWidth , window.innerHeight);
        window.addEventListener('resize', function () {
            renderer.setSize ( window.innerWidth , window.innerHeight);
            this.threeCamera.aspect = window.innerWidth / window.innerHeight;
            this.threeCamera.updateProjectionMatrix ();
        });
        document.body.appendChild ( renderer.domElement );
        //
        //cannon.js setup
        this.physicWorld = new CANNON.World();
        this.physicWorld.broadphase = new CANNON.NaiveBroadphase();

        this.update = function(timeStamp) {
            if (lastTime == undefined){
                lastTime = timeStamp;
                return;
            }
            dt += (timeStamp - lastTime) / 1000;
            if (dt >= 1/this.frameRate){
                renderer.render( this.threeScene , this.threeCamera);
                //this.threeCamera.updateProjectionMatrix();
                dt=0;
            }
        };
    }
    //GAME.Object
    context.WorldObject = function(){
        let self = this;
        let filename = undefined;
        let active = false;
        let loaded = false;
        let receiveShadow  = true;
        let gameScene = undefined ;
        let addedToScene = false;
        let material = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.FrontSide} );
        Object.defineProperty( this , "filename",{
            get: function(){
                return filename;},
            set: function(newValue){
                filename = newValue;
                this.load();
                //loaded = false;
            }
        });
        Object.defineProperty( this , "active",{
            get: function(){
                return active;},
            set: function(newValue){
                active = newValue;
                this.updateState();
            }
        });
        Object.defineProperty( this , "loaded",{
            get: function(){
                return loaded;
            },
            set: function(){
                throw console.error("'loaded' is read only");
                
            }
        });
        Object.defineProperty( this , "receiveShadow",{
            get: function(){
                return receiveShadow;},
            set: function(newValue){
                receiveShadow = newValue;
            }
        });
        Object.defineProperty( this , "gameScene",{
            get: function(){
                return gameScene;},
            set: function(newValue){
                if (addedToScene){
                    gameScene.threeScene.remove(self.threeObject);   
                }
                gameScene = newValue;
                this.updateState();
            }
        });
        Object.defineProperty( this , "material",{
            get: function(){
                return material;},
            set: function(newValue){
                material = newValue;
            }
        });
        this.threeObject = new THREE.Mesh();
        this.canvas = document.createElement("CANVAS");
        this.canvasContext = this.canvas.getContext("2d");
        this.image = document.createElement("IMG");
        this.load = function(){
            loaded = false;
            self.image.src = filename;
        }
        this.image.onload = function() {
            self.canvas.width = self.image.width;
            self.canvas.height = self.image.height;
            self.canvasContext.drawImage(self.image, 0, 0);

            loaded = true;
            self.buildGeometry();
            self.updateState();
        }
        this.buildGeometry = function(){

        }
        this.updateState = function(){
            if (active && loaded && gameScene && !addedToScene) {
                gameScene.threeScene.add(self.threeObject);
                addedToScene = true;
            } 
            if(!active && gameScene && addedToScene){
                gameScene.threeScene.remove(self.threeObject);
                addedToScene = false;
            }
        }
    }


})(GAME);