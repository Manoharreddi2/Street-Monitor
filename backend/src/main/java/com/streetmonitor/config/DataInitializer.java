package com.streetmonitor.config;

import com.streetmonitor.entity.Issue;
import com.streetmonitor.entity.User;
import com.streetmonitor.repository.IssueRepository;
import com.streetmonitor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final IssueRepository issueRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Create admin user
        User admin = User.builder()
                .name("Admin")
                .email("admin@streetmonitor.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(admin);

        // Create test user
        User user = User.builder()
                .name("Test User")
                .email("user@streetmonitor.com")
                .password(passwordEncoder.encode("user123"))
                .role(User.Role.USER)
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(user);

        // Create sample issues
        issueRepository.save(Issue.builder()
                .title("Large Pothole on MG Road")
                .description("A deep pothole near the bus stop causing accidents. Multiple vehicles have been damaged.")
                .type(Issue.IssueType.POTHOLE)
                .latitude(12.9716)
                .longitude(77.5946)
                .status(Issue.IssueStatus.REPORTED)
                .severity(4)
                .reporter(user)
                .voteCount(12)
                .createdAt(LocalDateTime.now().minusDays(3))
                .build());

        issueRepository.save(Issue.builder()
                .title("Traffic Signal Not Working")
                .description("The traffic signal at the main junction has been malfunctioning for 2 days.")
                .type(Issue.IssueType.TRAFFIC)
                .latitude(12.9352)
                .longitude(77.6245)
                .status(Issue.IssueStatus.IN_PROGRESS)
                .severity(5)
                .reporter(user)
                .voteCount(25)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build());

        issueRepository.save(Issue.builder()
                .title("Road Damage After Rain")
                .description("Heavy rain has washed away parts of the road surface. Gravel exposed.")
                .type(Issue.IssueType.ROAD_DAMAGE)
                .latitude(12.9783)
                .longitude(77.5710)
                .status(Issue.IssueStatus.REPORTED)
                .severity(3)
                .reporter(admin)
                .voteCount(8)
                .createdAt(LocalDateTime.now().minusHours(12))
                .build());

        issueRepository.save(Issue.builder()
                .title("Accident Near Flyover")
                .description("Two cars collided near the flyover ramp. Road partially blocked.")
                .type(Issue.IssueType.ACCIDENT)
                .latitude(12.9550)
                .longitude(77.6100)
                .status(Issue.IssueStatus.RESOLVED)
                .severity(5)
                .reporter(user)
                .voteCount(30)
                .createdAt(LocalDateTime.now().minusDays(5))
                .build());

        issueRepository.save(Issue.builder()
                .title("Streetlight Out on 5th Cross")
                .description("The streetlight has been out for a week. Very dark at night, unsafe for pedestrians.")
                .type(Issue.IssueType.STREETLIGHT)
                .latitude(12.9650)
                .longitude(77.5850)
                .status(Issue.IssueStatus.REPORTED)
                .severity(2)
                .reporter(user)
                .voteCount(5)
                .createdAt(LocalDateTime.now().minusDays(7))
                .build());

        System.out.println("=== Sample Data Initialized ===");
        System.out.println("Admin: admin@streetmonitor.com / admin123");
        System.out.println("User:  user@streetmonitor.com  / user123");
    }
}
