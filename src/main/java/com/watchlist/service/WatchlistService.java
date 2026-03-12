package com.watchlist.service;

import com.watchlist.dto.WatchlistItemRequest;
import com.watchlist.dto.WatchlistItemResponse;
import com.watchlist.model.Content;
import com.watchlist.model.User;
import com.watchlist.model.WatchlistItem;
import com.watchlist.model.enums.WatchStatus;
import com.watchlist.repository.WatchlistItemRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WatchlistService {

    private final WatchlistItemRepository watchlistItemRepository;
    private final ContentService contentService;
    private final UserService userService;

    public WatchlistService(WatchlistItemRepository watchlistItemRepository,
                            ContentService contentService,
                            UserService userService) {
        this.watchlistItemRepository = watchlistItemRepository;
        this.contentService = contentService;
        this.userService = userService;
    }

    public List<WatchlistItemResponse> getUserWatchlist(String username) {
        User user = userService.findByUsername(username);
        return watchlistItemRepository.findByUserId(user.getId())
                .stream()
                .map(WatchlistItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WatchlistItemResponse> getUserWatchlistByStatus(String username, WatchStatus status) {
        User user = userService.findByUsername(username);
        return watchlistItemRepository.findByUserIdAndStatus(user.getId(), status)
                .stream()
                .map(WatchlistItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public WatchlistItemResponse addToWatchlist(String username, WatchlistItemRequest request) {
        User user = userService.findByUsername(username);
        Content content = contentService.getContentById(request.getContentId());

        if (watchlistItemRepository.existsByUserIdAndContentId(user.getId(), content.getId())) {
            throw new RuntimeException("Content already in watchlist");
        }

        WatchlistItem item = new WatchlistItem();
        item.setUser(user);
        item.setContent(content);
        item.setStatus(request.getStatus() != null ? request.getStatus() : WatchStatus.PLAN_TO_WATCH);
        item.setUserRating(request.getUserRating());
        item.setCurrentEpisode(request.getCurrentEpisode() != null ? request.getCurrentEpisode() : 0);
        item.setNotes(request.getNotes());

        return WatchlistItemResponse.fromEntity(watchlistItemRepository.save(item));
    }

    public WatchlistItemResponse updateWatchlistItem(String username, Long itemId, WatchlistItemRequest request) {
        User user = userService.findByUsername(username);
        WatchlistItem item = watchlistItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Watchlist item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to watchlist item");
        }

        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }
        if (request.getUserRating() != null) {
            item.setUserRating(request.getUserRating());
        }
        if (request.getCurrentEpisode() != null) {
            item.setCurrentEpisode(request.getCurrentEpisode());
        }
        if (request.getNotes() != null) {
            item.setNotes(request.getNotes());
        }

        return WatchlistItemResponse.fromEntity(watchlistItemRepository.save(item));
    }

    public void removeFromWatchlist(String username, Long itemId) {
        User user = userService.findByUsername(username);
        WatchlistItem item = watchlistItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Watchlist item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to watchlist item");
        }

        watchlistItemRepository.delete(item);
    }

    public Map<String, Long> getWatchlistStats(String username) {
        User user = userService.findByUsername(username);
        Map<String, Long> stats = new HashMap<>();
        for (WatchStatus status : WatchStatus.values()) {
            stats.put(status.name(), watchlistItemRepository.countByUserIdAndStatus(user.getId(), status));
        }
        return stats;
    }
}
