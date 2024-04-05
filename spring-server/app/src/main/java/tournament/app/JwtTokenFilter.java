package tournament.app;

import java.time.Instant;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.MacAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tournament.model.Profile;
import tournament.service.ProfileService;

public abstract class JwtTokenFilter extends OncePerRequestFilter {
    protected static final Logger logger = LoggerFactory.getLogger(JwtTokenFilter.class);

    private static final int EXPIRE_LENGTH_SECONDS = 30 * 24 * 60 * 60; // 30 days

    private static final MacAlgorithm JWT_ALG = Jwts.SIG.HS512;
    private static final SecretKey JWT_KEY = JWT_ALG.key().build();

    protected ProfileService profileService;

    protected Optional<Authentication> readJwt(HttpServletRequest request) {
        logger.debug("Attempting to use JWT cookie for login.");
        return getCookieJwt(request)
                .map(jwt -> {
                    if (profileService.isJwtRevoked(jwt)) {
                        return null;
                    }
                    String email = parseEmailFromJwt(jwt);
                    if (email != null) {
                        logger.debug("Email for login: {}", email);
                        return profileService.findByEmail(email)
                                .map(profile -> new PreAuthenticatedAuthenticationToken(profile, jwt))
                                .orElse(null);
                    }
                    return null;
                });
    }

    public static Optional<String> getCookieJwt(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> cookie.getName().equals("jwt"))
                    .findFirst()
                    .map(Cookie::getValue);
        }
        return Optional.empty();
    }

    private String parseEmailFromJwt(String jwt) {
        try {
            Jws<Claims> jws = Jwts.parser()
                    .verifyWith(JWT_KEY)
                    .build()
                    .parseSignedClaims(jwt);
            return jws.getPayload().get("email", String.class);
        } catch (Exception e) {
            logger.error("Error parsing JWT", e);
            return null;
        }
    }

    protected Cookie buildCookie(String jwt) {
        int maxAgeSeconds = jwt != null ? EXPIRE_LENGTH_SECONDS : 0;
        Cookie cookie = new Cookie("jwt", jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(maxAgeSeconds);
        return cookie;
    }

    protected String buildJwt(Profile profile) {
        Instant now = Instant.now();
        return Jwts.builder()
                .issuer("iss")
                .subject("subj")
                .claim("email", profile.getEmail())
                // add more claims
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(EXPIRE_LENGTH_SECONDS)))
                .signWith(JWT_KEY, JWT_ALG)
                .compact();
    }

    protected Authentication buildAuth(Profile profile, HttpServletResponse response) {
        logger.debug("Profile for login: {}", profile);
        String jwt = buildJwt(profile);
        response.addCookie(buildCookie(jwt));
        return new PreAuthenticatedAuthenticationToken(profile, jwt);
    }
}
