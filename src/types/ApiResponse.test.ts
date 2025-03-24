import {
  ApiResponseStatus,
  buildSuccessfulApiResponse,
  buildErrorApiResponse,
} from "./ApiResponse";

describe("ApiResponse", () => {
  describe("buildSuccessfulApiResponse", () => {
    it("creates a successful API response with provided status and data", () => {
      // Arrange
      const status = ApiResponseStatus.SUCCESS;
      const data = { movieId: 1, title: "Avengers" };

      // Act
      const response = buildSuccessfulApiResponse(data);

      // Assert
      expect(response).toEqual({
        status,
        data,
        error: null,
      });
    });

    it("accepts null data", () => {
      // Arrange
      const status = ApiResponseStatus.SUCCESS;

      // Act
      const response = buildSuccessfulApiResponse(null);

      // Assert
      expect(response).toEqual({
        status,
        data: null,
        error: null,
      });
    });

    it("works with different types of data", () => {
      // Arrange & Act
      const stringResponse = buildSuccessfulApiResponse("string data");
      const numberResponse = buildSuccessfulApiResponse(22);
      const arrayResponse = buildSuccessfulApiResponse([
        { movieId: 1 },
        { movieId: 2 },
        { movieId: 3 },
      ]);

      // Assert
      expect(stringResponse.data).toBe("string data");
      expect(numberResponse.data).toBe(22);
      expect(arrayResponse.data).toEqual([
        { movieId: 1 },
        { movieId: 2 },
        { movieId: 3 },
      ]);
    });
  });

  describe("buildErrorApiResponse", () => {
    it("creates an error API response with provided status and error message", () => {
      // Arrange
      const status = ApiResponseStatus.ERROR;
      const error = "Something went wrong";

      // Act
      const response = buildErrorApiResponse(error);

      // Assert
      expect(response).toEqual({
        status,
        data: null,
        error,
      });
    });

    it("accepts null error", () => {
      // Arrange
      const status = ApiResponseStatus.ERROR;

      // Act
      const response = buildErrorApiResponse(null);

      // Assert
      expect(response).toEqual({
        status,
        data: null,
        error: null,
      });
    });
  });
});
