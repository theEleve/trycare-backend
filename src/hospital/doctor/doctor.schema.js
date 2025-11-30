"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorSchema = exports.Doctor = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var mongoose = require("mongoose");
var Doctor = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = mongoose_2.Document;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _specialization_decorators;
    var _specialization_initializers = [];
    var _specialization_extraInitializers = [];
    var _hospitalId_decorators;
    var _hospitalId_initializers = [];
    var _hospitalId_extraInitializers = [];
    var _doctorId_decorators;
    var _doctorId_initializers = [];
    var _doctorId_extraInitializers = [];
    var Doctor = _classThis = /** @class */ (function (_super) {
        __extends(Doctor_1, _super);
        function Doctor_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = __runInitializers(_this, _name_initializers, void 0);
            _this.specialization = (__runInitializers(_this, _name_extraInitializers), __runInitializers(_this, _specialization_initializers, void 0));
            _this.hospitalId = (__runInitializers(_this, _specialization_extraInitializers), __runInitializers(_this, _hospitalId_initializers, void 0));
            _this.doctorId = (__runInitializers(_this, _hospitalId_extraInitializers), __runInitializers(_this, _doctorId_initializers, void 0));
            __runInitializers(_this, _doctorId_extraInitializers);
            return _this;
        }
        return Doctor_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Doctor");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _name_decorators = [(0, mongoose_1.Prop)()];
        _specialization_decorators = [(0, mongoose_1.Prop)()];
        _hospitalId_decorators = [(0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' })];
        _doctorId_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _specialization_decorators, { kind: "field", name: "specialization", static: false, private: false, access: { has: function (obj) { return "specialization" in obj; }, get: function (obj) { return obj.specialization; }, set: function (obj, value) { obj.specialization = value; } }, metadata: _metadata }, _specialization_initializers, _specialization_extraInitializers);
        __esDecorate(null, null, _hospitalId_decorators, { kind: "field", name: "hospitalId", static: false, private: false, access: { has: function (obj) { return "hospitalId" in obj; }, get: function (obj) { return obj.hospitalId; }, set: function (obj, value) { obj.hospitalId = value; } }, metadata: _metadata }, _hospitalId_initializers, _hospitalId_extraInitializers);
        __esDecorate(null, null, _doctorId_decorators, { kind: "field", name: "doctorId", static: false, private: false, access: { has: function (obj) { return "doctorId" in obj; }, get: function (obj) { return obj.doctorId; }, set: function (obj, value) { obj.doctorId = value; } }, metadata: _metadata }, _doctorId_initializers, _doctorId_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Doctor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Doctor = _classThis;
}();
exports.Doctor = Doctor;
exports.DoctorSchema = mongoose_1.SchemaFactory.createForClass(Doctor);
