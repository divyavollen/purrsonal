package co.in.vollen.purrsonal.exception;

import java.security.InvalidParameterException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import co.in.vollen.purrsonal.dto.ErrorResponse;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({MethodArgumentNotValidException.class, InvalidParameterException.class})
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        List<String> errors = ex.getBindingResult()
                .getFieldErrors().stream()
                .map(error -> error.getField() + " : " + error.getDefaultMessage())
                .collect(Collectors.toList());

        ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(), errors,
                HttpStatus.BAD_REQUEST.value());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class })
    public ResponseEntity<ErrorResponse> handleBadCredentials(Exception ex, HttpServletRequest request) {

        ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(), List.of(ex.getMessage()),
                HttpStatus.UNAUTHORIZED.value());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex,
            HttpServletRequest request) {

        ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(), List.of(ex.getMessage()),
                HttpStatus.CONFLICT.value());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {

        ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(), List.of(ex.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR.value());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ErrorResponse createErrorResponse(String path, List<String> message, int statusCode) {

        return new ErrorResponse(path, message, statusCode, LocalDateTime.now());
    }
}
