export declare type SuperMouseParams = {
    logging?: boolean;
};
export interface SuperMouse {
    x: number;
    y: number;
    u: number;
    v: number;
    scrollX: number;
    scrollY: number;
    inertia: number;
    started: boolean;
    logging: boolean;
    dragging: boolean;
    clicked: boolean;
}
export declare class SuperMouse {
    constructor({ logging }: SuperMouseParams);
    handleClick: (e: MouseEvent) => void;
    handleScroll: (e: WheelEvent) => void;
    handleMove: (e: MouseEvent) => void;
    update: () => void;
}
