package com.streetmonitor.repository;

import com.streetmonitor.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByType(Issue.IssueType type);

    List<Issue> findByStatus(Issue.IssueStatus status);

    List<Issue> findByReporterId(Long reporterId);

    @Query("SELECT i FROM Issue i ORDER BY i.voteCount DESC")
    List<Issue> findAllOrderByVotesDesc();

    @Query("SELECT i FROM Issue i ORDER BY i.createdAt DESC")
    List<Issue> findAllOrderByCreatedAtDesc();

    @Query("SELECT i FROM Issue i WHERE " +
           "( 6371 * acos( cos( radians(:lat) ) * cos( radians( i.latitude ) ) * " +
           "cos( radians( i.longitude ) - radians(:lng) ) + sin( radians(:lat) ) * " +
           "sin( radians( i.latitude ) ) ) ) <= :radius ORDER BY i.createdAt DESC")
    List<Issue> findNearby(@Param("lat") double lat, @Param("lng") double lng, @Param("radius") double radiusKm);
}
