package tournament.app;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tournament.model.Profile;
import tournament.service.ProfileService;

public class LocalhostJwtTokenFilter extends JwtTokenFilter {
    
    public LocalhostJwtTokenFilter(ProfileService profileService) {
        this.profileService = profileService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String email = request.getParameter("code");
        Optional<Authentication> auth = StringUtils.isEmpty(email) ? readJwt(request) : Optional.of(getAuth(email, response));

        if (auth.isPresent()) {
            auth.get().setAuthenticated(true);
            SecurityContextHolder.getContext().setAuthentication(auth.get());
        } else {
            response.addCookie(buildCookie(null));
        }

        filterChain.doFilter(request, response);
    }

    private Authentication getAuth(String email, HttpServletResponse response) {
        Payload payload = new Payload();
        payload.setEmail(email);
        payload.set("given_name", "First");
        payload.set("family_name", "Last");
        payload.set("picture", "https://www.freeiconspng.com/thumbs/account-icon/account-profile-icon-2.png");
        Profile profile = profileService.getProfileFromPayload(payload);

        return buildAuth(profile, response);
    }
}
