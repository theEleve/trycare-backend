"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
var common_1 = require("@nestjs/common");
var DoctorController = function () {
    var _classDecorators = [(0, common_1.Controller)('doctor')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findOne_decorators;
    var _findByHospital_decorators;
    var _updateDoctor_decorators;
    var _removeDoctor_decorators;
    var DoctorController = _classThis = /** @class */ (function () {
        function DoctorController_1(doctorService) {
            this.doctorService = (__runInitializers(this, _instanceExtraInitializers), doctorService);
        }
        // CREATE A NEW DOCTOR
        // endpoint: /doctor/create
        DoctorController_1.prototype.create = function (body) {
            return this.doctorService.create(body);
        };
        // GET SPECIFIC DOCTOR UNDER A SPECIFIC HOSPITAL
        // endpoint: /doctor/:hospitalId/:doctorId
        DoctorController_1.prototype.findOne = function (hospitalId, doctorId) {
            return this.doctorService.findOneByHospital(hospitalId, doctorId);
        };
        // GET ALL DOCTORS UNDER A HOSPITAL
        // endpoint: /doctor/:hospitalId
        DoctorController_1.prototype.findByHospital = function (hospitalId) {
            return this.doctorService.findByHospital(hospitalId);
        };
        // UPDATE A DOCTOR'S INFO
        // endpoint: /doctor/:hospitalId/:doctorId
        DoctorController_1.prototype.updateDoctor = function (hospitalId, doctorId, body) {
            return this.doctorService.updateDoctor(hospitalId, doctorId, body);
        };
        // DELETE A DOCTOR FROM A HOSPITAL
        // endpoint: /doctor/:hospitalId/:doctorId
        DoctorController_1.prototype.removeDoctor = function (hospitalId, doctorId) {
            return this.doctorService.removeDoctor(hospitalId, doctorId);
        };
        return DoctorController_1;
    }());
    __setFunctionName(_classThis, "DoctorController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)('create')];
        _findOne_decorators = [(0, common_1.Get)('/:hospitalId/:doctorId')];
        _findByHospital_decorators = [(0, common_1.Get)('/:hospitalId')];
        _updateDoctor_decorators = [(0, common_1.Put)('/:hospitalId/:doctorId')];
        _removeDoctor_decorators = [(0, common_1.Delete)('/:hospitalId/:doctorId')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByHospital_decorators, { kind: "method", name: "findByHospital", static: false, private: false, access: { has: function (obj) { return "findByHospital" in obj; }, get: function (obj) { return obj.findByHospital; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateDoctor_decorators, { kind: "method", name: "updateDoctor", static: false, private: false, access: { has: function (obj) { return "updateDoctor" in obj; }, get: function (obj) { return obj.updateDoctor; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeDoctor_decorators, { kind: "method", name: "removeDoctor", static: false, private: false, access: { has: function (obj) { return "removeDoctor" in obj; }, get: function (obj) { return obj.removeDoctor; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DoctorController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DoctorController = _classThis;
}();
exports.DoctorController = DoctorController;
