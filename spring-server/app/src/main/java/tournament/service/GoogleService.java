package tournament.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class GoogleService {
    private static final Logger logger = LoggerFactory.getLogger(GoogleService.class);

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;
    
    public GoogleTokenResponse getToken(String authCode) throws IOException {
        return new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(),
                new GsonFactory(),
                clientId,
                clientSecret,
                authCode,
                "postmessage").setGrantType("authorization_code").execute();
    }

    public Optional<Payload> parseIdToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(List.of(clientId))
                    .build();
            GoogleIdToken idToken = verifier.verify(idTokenString);
            logger.debug("GoogleIdToken for login: {}", idToken);
            return Optional.of(idToken.getPayload());
        } catch (Exception e) {
            logger.error("Error parsing Google access token", e);
            return Optional.empty();
        }
    }
}
