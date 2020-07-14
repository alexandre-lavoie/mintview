export class Vector {
    public coords: number[];

    constructor(...coords: number[]) {
        this.coords = coords;
    }

    public toVector2(): Vector2 {
        if(this.coords.length > 2) {
            throw `Cannot transform to Vector 2X2 a Vector ${this.coords.length}X${this.coords.length}`;
        }
6
        return new Vector2(...this.coords);
    }

    public static clone(v: Vector): Vector {
        return new Vector(...v.coords);
    }

    public copy(): Vector {
        return new Vector(...this.coords);
    }

    public add(v: Vector): Vector {
        if(this.coords.length != v.coords.length) {
            throw `Cannot add Vector ${this.coords.length}X${this.coords.length} and Vector ${v.coords.length}X${v.coords.length}`;
        }

        return new Vector(...this.coords.map((c, i) => c + v.coords[i]));
    }
    
    public sub(v: Vector): Vector {
        if(this.coords.length != v.coords.length) {
            throw `Cannot sub Vector ${this.coords.length}X${this.coords.length} and Vector ${v.coords.length}X${v.coords.length}`;
        }

        return new Vector(...this.coords.map((c, i) => c - v.coords[i]));
    }

    public magnitude(): number {
        return Math.sqrt(this.coords.map(c => Math.pow(c, 2)).reduce((a, c) => a + c));
    }

    public normalize(): Vector {
        let mag = this.magnitude();

        return new Vector(...this.coords.map(c => c / mag));
    }

    public dot(v: Vector): number {
        if(this.coords.length != v.coords.length) {
            throw `Cannot dot Vector ${this.coords.length}X${this.coords.length} and Vector ${v.coords.length}X${v.coords.length}`;
        }

        return this.coords.map((c, i) => c * v.coords[i]).reduce((a, c) => a + c);
    }

    public scale(s: number): Vector {
        return new Vector(...this.coords.map(c => c * s));
    }

    public angleTo(v: Vector): number {
        return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
    }

    public distanceTo(v: Vector): number {
        return Math.sqrt(this.sub(v).coords.map(c => Math.pow(c, 2)).reduce((a, c) => a + c));
    }

    public projectOnto(b: Vector): Vector {
        return b.scale(b.dot(this) / Math.pow(b.magnitude(), 2));
    }

    public toString() {
        return `Vector ${this.coords}`;
    }
}

export class Vector2 extends Vector {
    public get x(): number {
        return this.coords[0];
    }

    public set x(v: number) {
        this.coords[0] = v;
    }

    public get y(): number {
        return this.coords[0];
    }

    public set y(v: number) {
        this.coords[0] = v;
    }

    constructor(x: number = 0, y: number = 0) {
        super(x, y);
    }
}