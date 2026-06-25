package com.ecotel.shared_library.exception;

import com.ecotel.shared_library.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 400 - @Valid trên @RequestBody thất bại
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        e -> e.getField(),
                        e -> e.getDefaultMessage(),
                        (a, b) -> a // giữ lỗi đầu tiên nếu 1 field có nhiều lỗi
                ));
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error("VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ", fieldErrors));
    }

    // 400 - @Validated trên @RequestParam / @PathVariable thất bại
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> fieldErrors = ex.getConstraintViolations()
                .stream()
                .collect(Collectors.toMap(
                        v -> v.getPropertyPath().toString(),
                        v -> v.getMessage(),
                        (a, b) -> a
                ));
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error("VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ", fieldErrors));
    }

    // 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("NOT_FOUND", ex.getMessage()));
    }

    // 409
    @ExceptionHandler(DocumentLockedException.class)
    public ResponseEntity<ApiResponse<Void>> handleDocumentLocked(DocumentLockedException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("DOCUMENT_LOCKED", ex.getMessage()));
    }

    @ExceptionHandler(SignatureOutOfSequenceException.class)
    public ResponseEntity<ApiResponse<Void>> handleSignatureOutOfSequence(SignatureOutOfSequenceException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("SIGNATURE_OUT_OF_SEQUENCE", ex.getMessage()));
    }

    @ExceptionHandler(AlreadySignedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAlreadySigned(AlreadySignedException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("ALREADY_SIGNED", ex.getMessage()));
    }

    // 422
    @ExceptionHandler(DuplicateCodeException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateCode(DuplicateCodeException ex) {
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error("DUPLICATE_CODE", ex.getMessage()));
    }

    @ExceptionHandler(BusinessValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessValidation(BusinessValidationException ex) {
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error("VALIDATION_ERROR", ex.getMessage()));
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ApiResponse<Void>> handleInsufficientStock(InsufficientStockException ex) {
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error("INSUFFICIENT_STOCK", ex.getMessage()));
    }

    @ExceptionHandler(CertificateRequiredException.class)
    public ResponseEntity<ApiResponse<Void>> handleCertificateRequired(CertificateRequiredException ex) {
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error("CERTIFICATE_REQUIRED", ex.getMessage()));
    }

    @ExceptionHandler(RatioSumInvalidException.class)
    public ResponseEntity<ApiResponse<Void>> handleRatioSumInvalid(RatioSumInvalidException ex) {
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error("RATIO_SUM_INVALID", ex.getMessage()));
    }

    @ExceptionHandler(EmptyListException.class)
    public ResponseEntity<ApiResponse<Void>> handleEmptyList(EmptyListException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("EMPTY_LIST", ex.getMessage()));
    }

    // 500 - fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("INTERNAL_ERROR", "Lỗi hệ thống, vui lòng thử lại sau"));
    }
}
