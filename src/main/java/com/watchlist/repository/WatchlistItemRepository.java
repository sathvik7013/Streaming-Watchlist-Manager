package com.watchlist.repository;

import com.watchlist.model.WatchlistItem;
import com.watchlist.model.enums.WatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistItemRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserId(Long userId);
    List<WatchlistItem> findByUserIdAndStatus(Long userId, WatchStatus status);
    Optional<WatchlistItem> findByUserIdAndContentId(Long userId, Long contentId);
    boolean existsByUserIdAndContentId(Long userId, Long contentId);
    long countByUserIdAndStatus(Long userId, WatchStatus status);
}
