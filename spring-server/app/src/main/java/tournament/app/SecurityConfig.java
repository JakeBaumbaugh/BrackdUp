package tournament.app;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import tournament.service.GoogleService;
import tournament.service.ProfileService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${dev.localhost:false}")
    private boolean devLocalhost;

    private ProfileService profileService;
    private GoogleService googleService;

    @Autowired
    public SecurityConfig(ProfileService profileService, GoogleService googleService) {
        this.profileService = profileService;
        this.googleService = googleService;
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring security filter chain.");
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(requests -> requests
                .requestMatchers("/tournament/vote").authenticated()
                .requestMatchers("/admin/**").authenticated()
                .requestMatchers(HttpMethod.POST).authenticated()
                .requestMatchers(HttpMethod.DELETE).authenticated()
                .requestMatchers(HttpMethod.GET).permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessHandler((request, response, authentication) -> {
                    JwtTokenFilter.getCookieJwt(request)
                            .ifPresent(jwt -> {
                                profileService.revokeJwt(jwt);
                                logger.info("Revoking JWT {}", jwt);
                            });
                    response.setStatus(200);
                })
                .deleteCookies("jwt")
            )
            .addFilterBefore(getJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    public CorsConfigurationSource corsConfigurationSource() {
        List<String> allowedOrigins = new ArrayList<>(4);
        allowedOrigins.add("https://madness.basefive.org");
        allowedOrigins.add("https://madness.basefive.org:3000");
        allowedOrigins.add("https://madness-dev.basefive.org:3000");
        if (devLocalhost) {
            allowedOrigins.add("https://localhost:3000");
        }

        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("HEAD", "GET", "POST", "OPTIONS", "DELETE"));
        config.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        config.setAllowCredentials(true);

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private JwtTokenFilter getJwtTokenFilter() {
        if (devLocalhost) {
            return new LocalhostJwtTokenFilter(profileService);
        } else {
            return new GoogleJwtTokenFilter(profileService, googleService);
        }
    }

}
