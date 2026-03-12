package com.watchlist.controller;

import com.watchlist.dto.WatchlistItemRequest;
import com.watchlist.dto.WatchlistItemResponse;
import com.watchlist.model.enums.WatchStatus;
import com.watchlist.service.WatchlistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<List<WatchlistItemResponse>> getWatchlist(Authentication authentication) {
        return ResponseEntity.ok(watchlistService.getUserWatchlist(authentication.getName()));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<WatchlistItemResponse>> getWatchlistByStatus(
            Authentication authentication,
            @RequestParam WatchStatus status) {
        return ResponseEntity.ok(watchlistService.getUserWatchlistByStatus(authentication.getName(), status));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getWatchlistStats(Authentication authentication) {
        return ResponseEntity.ok(watchlistService.getWatchlistStats(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<WatchlistItemResponse> addToWatchlist(
            Authentication authentication,
            @Valid @RequestBody WatchlistItemRequest request) {
        return ResponseEntity.ok(watchlistService.addToWatchlist(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WatchlistItemResponse> updateWatchlistItem(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody WatchlistItemRequest request) {
        return ResponseEntity.ok(watchlistService.updateWatchlistItem(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromWatchlist(
            Authentication authentication,
            @PathVariable Long id) {
        watchlistService.removeFromWatchlist(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
