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
exports.DiagnosisReportController = void 0;
var common_1 = require("@nestjs/common");
var DiagnosisReportController = function () {
    var _classDecorators = [(0, common_1.Controller)('diagnosis-report')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findOne_decorators;
    var _findByPatient_decorators;
    var _updateFeedback_decorators;
    var DiagnosisReportController = _classThis = /** @class */ (function () {
        function DiagnosisReportController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        DiagnosisReportController_1.prototype.create = function (dto) {
            return this.service.createReport(dto);
        };
        DiagnosisReportController_1.prototype.findOne = function (id) {
            return this.service.getReportById(id);
        };
        DiagnosisReportController_1.prototype.findByPatient = function (patientUserId) {
            return this.service.getReportsByPatient(patientUserId);
        };
        DiagnosisReportController_1.prototype.updateFeedback = function (id, dto) {
            return this.service.updateDoctorFeedback(id, dto);
        };
        return DiagnosisReportController_1;
    }());
    __setFunctionName(_classThis, "DiagnosisReportController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _findByPatient_decorators = [(0, common_1.Get)('patient/:patientUserId')];
        _updateFeedback_decorators = [(0, common_1.Patch)('feedback/:id')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByPatient_decorators, { kind: "method", name: "findByPatient", static: false, private: false, access: { has: function (obj) { return "findByPatient" in obj; }, get: function (obj) { return obj.findByPatient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateFeedback_decorators, { kind: "method", name: "updateFeedback", static: false, private: false, access: { has: function (obj) { return "updateFeedback" in obj; }, get: function (obj) { return obj.updateFeedback; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DiagnosisReportController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DiagnosisReportController = _classThis;
}();
exports.DiagnosisReportController = DiagnosisReportController;
