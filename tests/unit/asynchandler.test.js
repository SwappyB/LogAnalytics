"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("../../src/middlewares/asyncHandler");
describe('Async Handler', () => {
    it('should call the next function with an error when an exception occurs', async () => {
        const mockHandler = jest.fn().mockRejectedValue(new Error('Test error'));
        const wrappedHandler = (0, asyncHandler_1.asyncHandler)(mockHandler);
        const req = {};
        const res = {};
        const next = jest.fn();
        await wrappedHandler(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Test error'));
    });
    it('should call the handler normally when no exception occurs', async () => {
        const mockHandler = jest.fn().mockResolvedValue('Success');
        const wrappedHandler = (0, asyncHandler_1.asyncHandler)(mockHandler);
        const req = {};
        const res = {};
        const next = jest.fn();
        await wrappedHandler(req, res, next);
        expect(mockHandler).toHaveBeenCalledWith(req, res, next);
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });
});
