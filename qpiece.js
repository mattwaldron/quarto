import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js'

export const QHeight = { TALL: "tall", SHORT: "short" }
export const QShape = { ROUND: "round", SQUARE: "square" }
export const QDensity = { HOLLOW: "hollow", SOLID: "solid" }
export const QColor = { DARK: "dark", LIGHT: "light" }

export class QPiece {

    static lookupModel(h, s, d) {
        return h + '_' + s + '_' + d + '.obj';
    }

    static lookupColor(dl) {
        switch (dl) {
        case QColor.DARK: return 0x444444;
        case QColor.LIGHT: return 0xFFFFFF;
        default: return 0x808080;
        }
    }

    static objLoader = new OBJLoader();
    static scene = null;
    constructor(h, s, d, c, x, y) {
        if (QPiece.scene != null) {
            var objFilePath = 'models/' + QPiece.lookupModel(h, s, d);
            this.height = h;
            this.shape = s;
            this.density = d;
            this.color = c;
            this.model = null;
            QPiece.objLoader.load(objFilePath, (obj) => {
                this.model = obj;
                this.model.userData.qpiece = this;
                this.setColor(c);
                this.setPosition(x, y);
                QPiece.scene.add (obj);
            });
        }
    }

    setColor(c) {
        if (this.model != null) {
            this.model.traverse ( (child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.color.setHex(QPiece.lookupColor(c));
                    child.material.emissiveIntensity = 0;
                    //child.material.emissive.setHex(QPiece.lookupColor(c));
                }
            });
        }
    }

    setPosition(x, y) {
        if (this.model != null) {
            this.model.position.x = x;
            this.model.position.y = 0;
            this.model.position.z = y;
        }
    }

    setRotation(r) {
        if (this.model != null) {
            this.model.rotation.y = r;
        }
    }

    adjustRotation(r) {
        if (this.model != null) {
            this.model.rotation.y += r;
        }
    }

    get id() {
        return this.height.charAt(0) + this.shape.charAt(0) + this.density.charAt(0) + this.color.charAt(0);
    }

    get position() {
        if (model == null) {
           return {};
        }
        return {
            x: this.model.position.x, 
            y: this.model.position.y
        }
    }
}
