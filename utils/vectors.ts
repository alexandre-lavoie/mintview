export class Vector {
    /** Coordinates for vector. */
    public coords: number[];

    constructor(...coords: number[]) {
        this.coords = coords;
    }

    /**
     * Transforms current vector to vector2.
     */
    public toVector2(): Vector2 {
        if (this.coords.length > 2) {
            throw `Cannot transform to Vector 2X2 a Vector ${this.coords.length}X${this.coords.length}.`;
        }

        return new Vector2(...this.coords);
    }

    /**
     * Clones a passed vector.
     * @param v Vector to clone.
     */
    public static clone(v: Vector): Vector {
        return new Vector(...v.coords);
    }

    /**
     * Copies current vector.
     */
    public copy(): Vector {
        return new Vector(...this.coords);
    }

    /**
     * Adds passed vector to a clone of current vector.
     * @param v Vector to add.
     */
    public add(v: Vector): Vector {
        if (this.coords.length != v.coords.length) {
            throw `Cannot add Vector ${this.coords.length}X${this.coords.length} and Vector ${v.coords.length}X${v.coords.length}.`;
        }

        return new Vector(...this.coords.map((c, i) => c + v.coords[i]));
    }

    /**
     * Adds passed vector to current vector.
     * @param v Vector to add.
     */
    public addMutate(v: Vector): Vector {
        this.coords = this.add(v).coords;

        return this;
    }

    /**
     * Subtracts passed vector to a clone of current vector.
     * @param v Vector to substract.
     */
    public sub(v: Vector): Vector {
        if (this.coords.length != v.coords.length) {
            throw `Cannot sub Vector ${this.coords.length}X${this.coords.length} and Vector ${v.coords.length}X${v.coords.length}.`;
        }

        return new Vector(...this.coords.map((c, i) => c - v.coords[i]));
    }

    /**
     * Subtracts passed vector to current vector.
     * @param v Vector to substract.
     */
    public subMutate(v: Vector): Vector {
        this.coords = this.sub(v).coords;

        return this;
    }

    /**
     * Magnitude of current vector.
     */
    public magnitude(): number {
        return Math.sqrt(this.coords.map(c => Math.pow(c, 2)).reduce((a, c) => a + c));
    }

    /**
     * Checks if vector is the zero vector.
     */
    public isZero(): boolean {
        return this.magnitude() == 0;
    }

    /**
     * Normalizes the current vector.
     */
    public normalize(): Vector {
        if(this.isZero()) {
            throw `Cannot normalize the zero vector.`
        }

        let mag = this.magnitude();

        return new Vector(...this.coords.map(c => c / mag));
    }

    /**
     * Dot products passed vector to clone of current vector.
     * @param v Vector to dot product.
     */
    public dot(v: Vector): number {
        if (this.coords.length != v.coords.length) {
            throw `Cannot dot Vector ${this.coords.length}X${this.coords.length} and Vector ${v.coords.length}X${v.coords.length}`;
        }

        return this.coords.map((c, i) => c * v.coords[i]).reduce((a, c) => a + c);
    }

    /**
     * Scales clone of current vector.
     * @param s Scalar.
     */
    public scale(s: number): Vector {
        return new Vector(...this.coords.map(c => c * s));
    }

    /**
     * Scales current vector.
     * @param s Scalar.
     */
    public scaleMutate(s: number): Vector {
        this.coords = this.scale(s).coords;

        return this;
    }

    /**
     * Returns angle in radians from current vector to passed vector.
     * @param v Vector to find angle to.
     */
    public angleTo(v: Vector): number {
        return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
    }

    /**
     * Finds the distance from current vector to passed vector.
     * @param v Vector to find the distance to.
     */
    public distanceTo(v: Vector): number {
        return Math.sqrt(this.sub(v).coords.map(c => Math.pow(c, 2)).reduce((a, c) => a + c));
    }

    /**
     * Projects passed vector onto current vector.
     * @param b Vector to project from.
     */
    public projectOnto(b: Vector): Vector {
        return b.scale(b.dot(this) / Math.pow(b.magnitude(), 2));
    }

    /**
     * Converts vector to string.
     */
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