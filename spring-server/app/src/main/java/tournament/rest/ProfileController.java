package tournament.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import tournament.model.Profile;

@RestController
public class ProfileController {
    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);

    // Submit login request
    @PostMapping("/login")
    public Profile login(Authentication authentication) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to login from user {}", profile.getName());
        return profile;
    }
}
