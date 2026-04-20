import { getPaginationRange, formatPaginatedResponse } from '../../src/utils/pagination.helper.js';

describe('Pagination Helper', () => {
  describe('getPaginationRange', () => {
    it('should calculate correct range for first page', () => {
      const { from, to } = getPaginationRange(10, 0);
      expect(from).toBe(0);
      expect(to).toBe(9);
    });

    it('should calculate correct range for subsequent pages', () => {
      const { from, to } = getPaginationRange(10, 20);
      expect(from).toBe(20);
      expect(to).toBe(29);
    });

    it('should use default values if not provided', () => {
      const { from, to } = getPaginationRange();
      expect(from).toBe(0);
      expect(to).toBe(49); // Default limit is 50
    });
  });

  describe('formatPaginatedResponse', () => {
    it('should format response with correct metadata', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const count = 100;
      const limit = 10;
      const offset = 20;

      const response = formatPaginatedResponse(data, count, limit, offset);

      expect(response).toEqual({
        data,
        pagination: {
          total: 100,
          limit: 10,
          offset: 20
        }
      });
    });

    it('should handle missing count with default zero', () => {
      const response = formatPaginatedResponse([], null, 10, 0);
      expect(response.pagination.total).toBe(0);
    });
  });
});
