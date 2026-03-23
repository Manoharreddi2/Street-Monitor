package com.streetmonitor.service;

import com.streetmonitor.dto.IssueRequest;
import com.streetmonitor.dto.IssueResponse;
import com.streetmonitor.entity.Issue;
import com.streetmonitor.entity.User;
import com.streetmonitor.entity.Vote;
import com.streetmonitor.repository.IssueRepository;
import com.streetmonitor.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final VoteRepository voteRepository;

    @Transactional
    public IssueResponse createIssue(IssueRequest request, User reporter) {
        Issue issue = Issue.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(Issue.IssueType.valueOf(request.getType()))
                .imageData(request.getImageData())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .severity(request.getSeverity() != null ? request.getSeverity() : 1)
                .status(Issue.IssueStatus.REPORTED)
                .reporter(reporter)
                .voteCount(0)
                .createdAt(LocalDateTime.now())
                .build();

        Issue saved = issueRepository.save(issue);
        return IssueResponse.fromEntity(saved, false);
    }

    public List<IssueResponse> getAllIssues(String type, String status, String sort, Long userId) {
        List<Issue> issues;

        if (sort != null && sort.equals("votes")) {
            issues = issueRepository.findAllOrderByVotesDesc();
        } else {
            issues = issueRepository.findAllOrderByCreatedAtDesc();
        }

        // Filter by type
        if (type != null && !type.isEmpty()) {
            try {
                Issue.IssueType issueType = Issue.IssueType.valueOf(type);
                issues = issues.stream()
                        .filter(i -> i.getType() == issueType)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException ignored) {}
        }

        // Filter by status
        if (status != null && !status.isEmpty()) {
            try {
                Issue.IssueStatus issueStatus = Issue.IssueStatus.valueOf(status);
                issues = issues.stream()
                        .filter(i -> i.getStatus() == issueStatus)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException ignored) {}
        }

        return issues.stream()
                .map(issue -> {
                    boolean hasVoted = userId != null && voteRepository.existsByUserIdAndIssueId(userId, issue.getId());
                    return IssueResponse.fromEntity(issue, hasVoted);
                })
                .collect(Collectors.toList());
    }

    public IssueResponse getIssueById(Long id, Long userId) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        boolean hasVoted = userId != null && voteRepository.existsByUserIdAndIssueId(userId, issue.getId());
        return IssueResponse.fromEntity(issue, hasVoted);
    }

    @Transactional
    public IssueResponse updateStatus(Long id, String statusStr) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        Issue.IssueStatus newStatus = Issue.IssueStatus.valueOf(statusStr);
        issue.setStatus(newStatus);
        Issue saved = issueRepository.save(issue);
        return IssueResponse.fromEntity(saved, false);
    }

    @Transactional
    public IssueResponse toggleVote(Long issueId, User user) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        var existingVote = voteRepository.findByUserIdAndIssueId(user.getId(), issueId);

        if (existingVote.isPresent()) {
            // Remove vote
            voteRepository.delete(existingVote.get());
            issue.setVoteCount(Math.max(0, issue.getVoteCount() - 1));
            Issue saved = issueRepository.save(issue);
            return IssueResponse.fromEntity(saved, false);
        } else {
            // Add vote
            Vote vote = Vote.builder()
                    .user(user)
                    .issue(issue)
                    .build();
            voteRepository.save(vote);
            issue.setVoteCount(issue.getVoteCount() + 1);
            Issue saved = issueRepository.save(issue);
            return IssueResponse.fromEntity(saved, true);
        }
    }

    public List<IssueResponse> getNearbyIssues(double lat, double lng, double radius, Long userId) {
        List<Issue> issues = issueRepository.findNearby(lat, lng, radius);
        return issues.stream()
                .map(issue -> {
                    boolean hasVoted = userId != null && voteRepository.existsByUserIdAndIssueId(userId, issue.getId());
                    return IssueResponse.fromEntity(issue, hasVoted);
                })
                .collect(Collectors.toList());
    }
}
