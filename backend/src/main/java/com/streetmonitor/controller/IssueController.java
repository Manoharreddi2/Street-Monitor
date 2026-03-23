package com.streetmonitor.controller;

import com.streetmonitor.dto.IssueRequest;
import com.streetmonitor.dto.IssueResponse;
import com.streetmonitor.dto.StatusUpdateRequest;
import com.streetmonitor.entity.User;
import com.streetmonitor.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @PostMapping
    public ResponseEntity<IssueResponse> createIssue(
            @Valid @RequestBody IssueRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(issueService.createIssue(request, user));
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> getAllIssues(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "recent") String sort,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(issueService.getAllIssues(type, status, sort, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(issueService.getIssueById(id, userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IssueResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(issueService.updateStatus(id, request.getStatus()));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<IssueResponse> toggleVote(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(issueService.toggleVote(id, user));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<IssueResponse>> getNearbyIssues(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radius,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(issueService.getNearbyIssues(lat, lng, radius, userId));
    }
}
