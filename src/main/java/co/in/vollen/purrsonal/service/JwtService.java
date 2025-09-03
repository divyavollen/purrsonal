package co.in.vollen.purrsonal.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret.key}")
    public String SECRET;

    private final CustomUserDetailsService userDetailsService;

    public String generateToken(String username) {
        return JWT.create()
                .withIssuer("Purrsonal App")
                .withSubject(username)
                .withIssuedAt(Instant.now())
                .withExpiresAt(Instant.now().plusSeconds(3600)) // Token valid for 1 hour
                .sign(Algorithm.HMAC256(SECRET));
    }

    public UserDetails validateTokenAndRetrieveUser(String token) throws JWTVerificationException {

        DecodedJWT jwt = JWT.require(Algorithm.HMAC256(SECRET))
                .withIssuer("Purrsonal App")
                .build().verify(token);

        String username = jwt.getSubject();
        return userDetailsService.loadUserByUsername(username);
    }

}
