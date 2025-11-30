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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosisReportSchema = exports.DiagnosisReport = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var DiagnosisReport = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
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
    var _doctorFeedback_decorators;
    var _doctorFeedback_initializers = [];
    var _doctorFeedback_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var DiagnosisReport = _classThis = /** @class */ (function () {
        function DiagnosisReport_1() {
            this.patientUserId = __runInitializers(this, _patientUserId_initializers, void 0);
            this.symptoms = (__runInitializers(this, _patientUserId_extraInitializers), __runInitializers(this, _symptoms_initializers, void 0));
            this.severity = (__runInitializers(this, _symptoms_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.aiGeneratedDiagnosis = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _aiGeneratedDiagnosis_initializers, void 0)); // AI generated diagnosis / suggestion
            this.doctorFeedback = (__runInitializers(this, _aiGeneratedDiagnosis_extraInitializers), __runInitializers(this, _doctorFeedback_initializers, void 0));
            this.status = (__runInitializers(this, _doctorFeedback_extraInitializers), __runInitializers(this, _status_initializers, void 0)); // pending | reviewed | closed
            __runInitializers(this, _status_extraInitializers);
        }
        return DiagnosisReport_1;
    }());
    __setFunctionName(_classThis, "DiagnosisReport");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _patientUserId_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _symptoms_decorators = [(0, mongoose_1.Prop)({ type: Object, required: true })];
        _severity_decorators = [(0, mongoose_1.Prop)({ type: Number, required: true })];
        _aiGeneratedDiagnosis_decorators = [(0, mongoose_1.Prop)({ type: Object, required: true })];
        _doctorFeedback_decorators = [(0, mongoose_1.Prop)({ type: Object, default: null })];
        _status_decorators = [(0, mongoose_1.Prop)({ default: 'pending' })];
        __esDecorate(null, null, _patientUserId_decorators, { kind: "field", name: "patientUserId", static: false, private: false, access: { has: function (obj) { return "patientUserId" in obj; }, get: function (obj) { return obj.patientUserId; }, set: function (obj, value) { obj.patientUserId = value; } }, metadata: _metadata }, _patientUserId_initializers, _patientUserId_extraInitializers);
        __esDecorate(null, null, _symptoms_decorators, { kind: "field", name: "symptoms", static: false, private: false, access: { has: function (obj) { return "symptoms" in obj; }, get: function (obj) { return obj.symptoms; }, set: function (obj, value) { obj.symptoms = value; } }, metadata: _metadata }, _symptoms_initializers, _symptoms_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: function (obj) { return "severity" in obj; }, get: function (obj) { return obj.severity; }, set: function (obj, value) { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _aiGeneratedDiagnosis_decorators, { kind: "field", name: "aiGeneratedDiagnosis", static: false, private: false, access: { has: function (obj) { return "aiGeneratedDiagnosis" in obj; }, get: function (obj) { return obj.aiGeneratedDiagnosis; }, set: function (obj, value) { obj.aiGeneratedDiagnosis = value; } }, metadata: _metadata }, _aiGeneratedDiagnosis_initializers, _aiGeneratedDiagnosis_extraInitializers);
        __esDecorate(null, null, _doctorFeedback_decorators, { kind: "field", name: "doctorFeedback", static: false, private: false, access: { has: function (obj) { return "doctorFeedback" in obj; }, get: function (obj) { return obj.doctorFeedback; }, set: function (obj, value) { obj.doctorFeedback = value; } }, metadata: _metadata }, _doctorFeedback_initializers, _doctorFeedback_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DiagnosisReport = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DiagnosisReport = _classThis;
}();
exports.DiagnosisReport = DiagnosisReport;
exports.DiagnosisReportSchema = mongoose_1.SchemaFactory.createForClass(DiagnosisReport);
