export class MapUtils {
    constructor() {
        this.mapPostitions = MapUtils.mapPositions;
        this.subscribers = [];
    }

    private _mapPostitions: number[];
    public get mapPostitions(): number[] {
        return this._mapPostitions;
    }
    public set mapPostitions(value: number[]) {
        this._mapPostitions = value;
    }

    public subscribers: Function[];

    setMapPositions(value: number[]) {
        this._mapPostitions = value;
        this.notifySubscribers();
    }

    subscribe(callback: Function) {
        this.subscribers.push(callback);
    }

    unsubsrcibe(callback: Function) {
        this.subscribers = this.subscribers.filter(x => x !== callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this._mapPostitions
        ));
    }

    public static mapPositions: number[] = [51.601839, 18.942589];
}

const mapUtils = new MapUtils();
export default mapUtils;