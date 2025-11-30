"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDiagnosisReportDto = void 0;
var class_validator_1 = require("class-validator");
var CreateDiagnosisReportDto = function () {
    var _a;
    var _patientUserId_decorators;
    var _patientUserId_initializers = [];
    var _patientUserId_extraInitializers = [];
    var _symptoms_decorators;
    var _symptoms_initializers = [];
    var _symptoms_extraInitializers = [];
    var _severity_decorators;
    var _severity_initializers = [];
    var _severity_extraInitializers = [];
    var _aiGeneratedDiagnosis_decorators;
    var _aiGeneratedDiagnosis_initializers = [];
    var _aiGeneratedDiagnosis_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateDiagnosisReportDto() {
                this.patientUserId = __runInitializers(this, _patientUserId_initializers, void 0);
                this.symptoms = (__runInitializers(this, _patientUserId_extraInitializers), __runInitializers(this, _symptoms_initializers, void 0));
                this.severity = (__runInitializers(this, _symptoms_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.aiGeneratedDiagnosis = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _aiGeneratedDiagnosis_initializers, void 0));
                __runInitializers(this, _aiGeneratedDiagnosis_extraInitializers);
            }
            return CreateDiagnosisReportDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _patientUserId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _symptoms_decorators = [(0, class_validator_1.IsObject)()];
            _severity_decorators = [(0, class_validator_1.IsNumber)()];
            _aiGeneratedDiagnosis_decorators = [(0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _patientUserId_decorators, { kind: "field", name: "patientUserId", static: false, private: false, access: { has: function (obj) { return "patientUserId" in obj; }, get: function (obj) { return obj.patientUserId; }, set: function (obj, value) { obj.patientUserId = value; } }, metadata: _metadata }, _patientUserId_initializers, _patientUserId_extraInitializers);
            __esDecorate(null, null, _symptoms_decorators, { kind: "field", name: "symptoms", static: false, private: false, access: { has: function (obj) { return "symptoms" in obj; }, get: function (obj) { return obj.symptoms; }, set: function (obj, value) { obj.symptoms = value; } }, metadata: _metadata }, _symptoms_initializers, _symptoms_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: function (obj) { return "severity" in obj; }, get: function (obj) { return obj.severity; }, set: function (obj, value) { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _aiGeneratedDiagnosis_decorators, { kind: "field", name: "aiGeneratedDiagnosis", static: false, private: false, access: { has: function (obj) { return "aiGeneratedDiagnosis" in obj; }, get: function (obj) { return obj.aiGeneratedDiagnosis; }, set: function (obj, value) { obj.aiGeneratedDiagnosis = value; } }, metadata: _metadata }, _aiGeneratedDiagnosis_initializers, _aiGeneratedDiagnosis_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateDiagnosisReportDto = CreateDiagnosisReportDto;
