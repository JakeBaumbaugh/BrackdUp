package tournament.app;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tournament.service.GoogleService;
import tournament.service.ProfileService;

public class GoogleJwtTokenFilter extends JwtTokenFilter {
    
    private GoogleService googleService;

    public GoogleJwtTokenFilter(ProfileService profileService, GoogleService googleService) {
        this.profileService = profileService;
        this.googleService = googleService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String googleLoginCode = request.getParameter("code");
        Optional<Authentication> auth = StringUtils.isEmpty(googleLoginCode) ? readJwt(request) : performGoogleLogin(googleLoginCode, response);

        if (auth.isPresent()) {
            auth.get().setAuthenticated(true);
            SecurityContextHolder.getContext().setAuthentication(auth.get());
        } else {
            response.addCookie(buildCookie(null));
        }

        filterChain.doFilter(request, response);
    }

    private Optional<Authentication> performGoogleLogin(String googleLoginCode, HttpServletResponse response) throws IOException {
        logger.debug("Attempting to use Google Oauth for login.");
        GoogleTokenResponse tokenResponse = googleService.getToken(googleLoginCode);
        logger.debug("GoogleTokenResponse for login: {}", tokenResponse);
        return googleService.parseIdToken(tokenResponse.getIdToken())
                    .map(payload -> profileService.getProfileFromPayload(payload))
                    .map(profile -> {
                        logger.debug("Profile for login: {}", profile);
                        String jwt = buildJwt(profile);
                        response.addCookie(buildCookie(jwt));
                        return new PreAuthenticatedAuthenticationToken(profile, jwt);
                    });
    }
}
