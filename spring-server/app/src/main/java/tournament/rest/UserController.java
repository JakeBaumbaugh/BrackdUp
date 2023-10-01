package tournament.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @PostMapping("/login")
    public Boolean login() {
        logger.info("POST request for login");
        return Boolean.TRUE;
    }
}
