import { QInteractive } from './qinteractive.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export class QSquare extends QInteractive {
    
    static scene = null;
    static squareSize = 5;
    static clickCallback = null;

    _squareDescriptor() {
        return "col " + this.x + ", row " + this.y;
    }

    constructor(x, y, squareSize) {
        super();
        super.type = "square";
        this.x = x;
        this.y = y;
        super.id = this._squareDescriptor();
        this.occupant = null;
        
        if (QSquare.scene != null) {
            var geometry = new THREE.BoxGeometry(QSquare.squareSize, 0.2, QSquare.squareSize);
            var color = 0x99AABB;
            if ((x+y)%2 == 0) {
                color = 0x8899AA;
            }
            var material = new THREE.MeshBasicMaterial( { color: color } );
            this.model = new THREE.Mesh(geometry, material);
            this.model.position.x = (x-1.5) * squareSize;
            this.model.position.z = (y-1.5) * squareSize;
            this.model.userData.qinteractive = this;
            QSquare.scene.add(this.model);
        }
    }

    onClick() {
        if (QSquare.clickCallback != null) {
            QSquare.clickCallback(this);
        }
    }

    remove() {
        QSquare.scene.remove(this.model);
    }

    getModelX() {
        return this.model.position.x;
    }

    getModelY() {
        return this.model.position.z;
    }
}
