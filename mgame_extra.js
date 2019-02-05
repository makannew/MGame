
//GAME.PlaneObject
GAME.PlaneObject = function( option={} ) {
    //inheritate from GAME.WorldObject
    //call parent constructor first
    GAME.WorldObject.prototype.constructor.call( this );
    let self = this;
    //overwrite parent method
    this.buildGeometry = function() {
        let planeGeometry = new THREE.PlaneGeometry(self.image.width , self.image.height);
        let planeTexture = new THREE.Texture(self.canvas);
        planeTexture.needsUpdate = true;
        self.material.map = planeTexture;
        self.threeObject.material = self.material;
        self.threeObject.geometry = planeGeometry;

    }
    //check optional passed arguments
    if (option["filename"]) {
        this.filename = option["filename"];
    }
    if (option["active"]) {
        this.active = option["active"];
    }
    if (option["receiveShadow"]) {
        this.receiveShadow = option["receiveShadow"];
    }
    if (option["gameScene"]) {
        this.gameScene = option["gameScene"];
    }


}



