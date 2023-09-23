package tournament.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication //(exclude = SecurityAutoConfiguration.class)
@ComponentScan(basePackages = "tournament")
@EntityScan(basePackages = "tournament.model")
@EnableJpaRepositories(basePackages = "tournament.repository")
public class App {
	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}

}
