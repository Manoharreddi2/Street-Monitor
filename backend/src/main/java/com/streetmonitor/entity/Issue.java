package com.streetmonitor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueType type;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageData;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private IssueStatus status = IssueStatus.REPORTED;

    @Column(nullable = false)
    @Builder.Default
    private Integer severity = 1;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Builder.Default
    private Integer voteCount = 0;

    public enum IssueType {
        POTHOLE, ACCIDENT, TRAFFIC, ROAD_DAMAGE, STREETLIGHT, FLOODING, OTHER
    }

    public enum IssueStatus {
        REPORTED, IN_PROGRESS, RESOLVED
    }
}
