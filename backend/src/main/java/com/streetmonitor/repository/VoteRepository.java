package com.streetmonitor.repository;

import com.streetmonitor.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserIdAndIssueId(Long userId, Long issueId);
    boolean existsByUserIdAndIssueId(Long userId, Long issueId);
    long countByIssueId(Long issueId);
}
