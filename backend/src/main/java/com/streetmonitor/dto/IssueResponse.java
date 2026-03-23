package com.streetmonitor.dto;

import com.streetmonitor.entity.Issue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class IssueResponse {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String imageData;
    private Double latitude;
    private Double longitude;
    private String status;
    private Integer severity;
    private LocalDateTime createdAt;
    private Integer voteCount;
    private String reporterName;
    private Long reporterId;
    private Boolean hasVoted;

    public static IssueResponse fromEntity(Issue issue, Boolean hasVoted) {
        return IssueResponse.builder()
                .id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType().name())
                .imageData(issue.getImageData())
                .latitude(issue.getLatitude())
                .longitude(issue.getLongitude())
                .status(issue.getStatus().name())
                .severity(issue.getSeverity())
                .createdAt(issue.getCreatedAt())
                .voteCount(issue.getVoteCount())
                .reporterName(issue.getReporter().getName())
                .reporterId(issue.getReporter().getId())
                .hasVoted(hasVoted)
                .build();
    }
}
