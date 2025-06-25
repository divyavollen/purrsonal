package co.in.vollen.purrsonal.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
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
    
    public String generateToken(String username) {

        try {
            return JWT.create()
                    .withSubject(USERNAME)
                    .withClaim(USERNAME, username)
                    .withIssuer(ISSUER)
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + expirationMs))
                    .sign(Algorithm.HMAC256(secret));

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
