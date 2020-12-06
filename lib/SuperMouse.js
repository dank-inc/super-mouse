"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperMouse = void 0;
var SuperMouse = /** @class */ (function () {
    // TODO: Modifyer keys
    function SuperMouse(_a) {
        var _this = this;
        var logging = _a.logging;
        this.handleClick = function (e) {
            var clickState = {};
            console.log("Clicked button => " + e.button);
            console.log("SuperMouse.click =>", e, _this);
            _this.clicked = true;
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true;
        };
        this.handleScroll = function (e) {
            // Put scroll in an object:
            var scrollState = {
                y: 0,
                x: 0,
                shiftX: 0,
                shiftY: 0,
            };
            console.log(e);
            var ctrl = e.ctrlKey;
            var shift = e.shiftKey;
            // TODO: invert scroll option
            _this.scrollX += e.deltaX * -1;
            _this.scrollY += e.deltaY * -1;
            console.log("SuperMouse.scroll", _this.scrollX, _this.scrollY);
        };
        this.handleMove = function (e) {
            // get delta time
            var positionState = {};
            var lastU = _this.u;
            var lastV = _this.v;
            _this.x = e.clientX;
            _this.y = e.clientY;
            _this.u = _this.x / window.innerWidth;
            _this.v = _this.y / window.innerHeight;
            if (!_this.started) {
                _this.started = true;
                return;
            }
            // get vector/ add to inertia
            var force = Math.pow((lastU - _this.u), 2) + Math.pow((lastV - _this.v), 2);
            _this.inertia += force * 50;
            // console.log(force, this.inertia)
        };
        // TODO: better update / get state cycle
        this.update = function () {
            _this.inertia *= 0.97;
            _this.clicked = false;
        };
        this.x = 0;
        this.y = 0;
        this.u = 0;
        this.v = 0;
        this.scrollX = 0;
        this.scrollY = 0;
        this.inertia = 0;
        this.started = false;
        this.logging = !!logging;
        this.dragging = false;
        this.clicked = false;
        window.addEventListener("mousemove", this.handleMove);
        window.addEventListener("mousedown", this.handleClick);
        // @ts-ignore
        window.addEventListener("mousewheel", this.handleScroll);
        window.addEventListener("contextmenu", function (e) { return e.preventDefault(); });
    }
    return SuperMouse;
}());
exports.SuperMouse = SuperMouse;
