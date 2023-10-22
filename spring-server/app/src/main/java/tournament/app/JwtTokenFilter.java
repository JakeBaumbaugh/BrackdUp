package tournament.app;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tournament.model.Profile;
import tournament.service.ProfileService;

public class JwtTokenFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenFilter.class);

    private ProfileService profileService;

    public JwtTokenFilter(ProfileService profileService) {
        this.profileService = profileService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String cookieToken = getTokenFromCookie(request);
        String token = cookieToken != null ? cookieToken : getTokenFromHeader(request);
        logger.debug("Found token: {}", token);

        Payload payload = null;
        if(token != null) {
            payload = parseToken(token);
            if(payload == null) {
                logger.debug("Payload null.");
            } else {
                logger.debug("Payload found for user {}.", payload.get("name"));
            }
        }

        if (payload != null) {
            Profile profile = profileService.getProfileFromPayload(payload);
            Authentication auth = new PreAuthenticatedAuthenticationToken(profile, token);
            auth.setAuthenticated(true);
            SecurityContextHolder.getContext().setAuthentication(auth);
            if(cookieToken == null) {
                response.addCookie(buildCookie(token));
            }
        } else {
            response.addCookie(buildCookie(null));
        }

        filterChain.doFilter(request, response);
    }
    
    private String getTokenFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> cookie.getName().equals("jwt"))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }
        return null;
    }

    private Payload parseToken(String jwt) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(List.of("809997101751-gca7bdfjfc8a7c3cftr6bqij1g3hdf5f.apps.googleusercontent.com"))
                    .build();
            GoogleIdToken idToken = verifier.verify(jwt);
            return idToken.getPayload();
        } catch (Exception e) {
            return null;
        }
    }

    private Cookie buildCookie(String jwt) {
        int maxAgeSeconds = jwt != null ? (60 * 60 * 24 * 7) : 0;
        Cookie cookie = new Cookie("jwt", jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(maxAgeSeconds);
        logger.debug("Built jwt cookie: {}", cookie);
        return cookie;
    }
}
