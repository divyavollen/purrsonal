package co.in.vollen.purrsonal.security;

import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

@Component
public class JWTUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms:3600000}") // Default to 1 hour
    private long expirationMs;

    private static final String ISSUER = "PurrsonalPetApp";
    private static final String USERNAME = "username";

    public ResponseCookie generateToken(String username) {

        Date issuedAt = new Date();
        long millis = System.currentTimeMillis() + expirationMs;
        Date expiresAt = new Date(millis);
        
        try {
            String token = JWT.create()
                    .withSubject(USERNAME)
                    .withClaim(USERNAME, username)
                    .withIssuer(ISSUER)
                    .withIssuedAt(issuedAt)
                    .withExpiresAt(expiresAt)
                    .sign(Algorithm.HMAC256(secret));

            ResponseCookie cookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(false) 
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(Duration.ofSeconds(expirationMs / 1000))
                    .build();

            return cookie;

        } catch (JWTCreationException e) {
            throw new RuntimeException("Error creating JWT token", e);
        }
    }

    public String validateTokenAndRetrieveSubject(String token) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                    .withSubject(USERNAME)
                    .withIssuer(ISSUER)
                    .build();

            DecodedJWT jwt = verifier.verify(token);
            return jwt.getClaim(USERNAME).asString();

        } catch (JWTVerificationException e) {
            throw new RuntimeException("Invalid or expired JWT token", e);
        }
    }
}
