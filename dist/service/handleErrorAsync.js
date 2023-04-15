"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorAsync = void 0;
const handleErrorAsync = (func) => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};
exports.handleErrorAsync = handleErrorAsync;
//# sourceMappingURL=handleErrorAsync.js.map