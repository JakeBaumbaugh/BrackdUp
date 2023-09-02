plugins {
    // Apply the application plugin to add support for building a CLI application in Java.
    application
    id("org.springframework.boot") version "3.1.3"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.guava:guava:31.1-jre")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.1.3")
	implementation("org.springframework.boot:spring-boot-starter-web:3.1.3")

    testImplementation("org.junit.jupiter:junit-jupiter:5.9.1")
    testImplementation("org.springframework.boot:spring-boot-starter-test:3.1.3")
}

application {
    // Define the main class for the application.
    mainClass.set("tournament.app.App")
}

tasks.named<Test>("test") {
    // Use JUnit Platform for unit tests.
    useJUnitPlatform()
}
