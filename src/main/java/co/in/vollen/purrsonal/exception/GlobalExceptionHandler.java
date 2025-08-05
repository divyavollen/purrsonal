package co.in.vollen.purrsonal.exception;

import java.security.InvalidParameterException;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import co.in.vollen.purrsonal.dto.ApiFieldError;
import co.in.vollen.purrsonal.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex,
                        HttpServletRequest request) {

                List<ApiFieldError> fieldErrors = ex.getBindingResult()
                                .getFieldErrors().stream()
                                .sorted(Comparator.comparing(FieldError::getField)
                                                .thenComparing(FieldError::getDefaultMessage))
                                .map(error -> new ApiFieldError(error.getField(), error.getDefaultMessage()))
                                .collect(Collectors.toList());

                ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(), fieldErrors,
                                HttpStatus.BAD_REQUEST.value());

                return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class,
                        AuthenticationCredentialsNotFoundException.class })
        public ResponseEntity<ErrorResponse> handleBadCredentials(Exception ex, HttpServletRequest request) {

                ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(),
                                List.of(new ApiFieldError("global", ex.getMessage())),
                                HttpStatus.UNAUTHORIZED.value());
                log.error("Authentication error: {}", errorResponse.toString());
                return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(UserAlreadyExistsException.class)
        public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex,
                        HttpServletRequest request) {

                ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(),
                                List.of(new ApiFieldError("global", ex.getMessage())),
                                HttpStatus.CONFLICT.value());

                return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.CONFLICT);
        }

        @ExceptionHandler({ JWTVerificationException.class, JWTDecodeException.class })
        public ResponseEntity<ErrorResponse> handleTokenValidationExceptions(Exception ex,
                        HttpServletRequest request) {

                ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(),
                                List.of(new ApiFieldError("global", ex.getMessage())),
                                HttpStatus.UNAUTHORIZED.value());

                return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {

                ErrorResponse errorResponse = createErrorResponse(request.getRequestURI(),
                                List.of(new ApiFieldError("global", ex.getMessage())),
                                HttpStatus.INTERNAL_SERVER_ERROR.value());

                return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        private ErrorResponse createErrorResponse(String path, List<ApiFieldError> fieldErrors, int statusCode) {

                return new ErrorResponse(path, fieldErrors, statusCode, LocalDateTime.now());
        }
}
