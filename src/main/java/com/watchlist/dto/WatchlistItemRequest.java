package com.watchlist.dto;

import com.watchlist.model.enums.WatchStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class WatchlistItemRequest {

    @NotNull(message = "Content ID is required")
    private Long contentId;

    private WatchStatus status;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 10, message = "Rating must be at most 10")
    private Integer userRating;

    private Integer currentEpisode;

    private String notes;

    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }

    public WatchStatus getStatus() { return status; }
    public void setStatus(WatchStatus status) { this.status = status; }

    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }

    public Integer getCurrentEpisode() { return currentEpisode; }
    public void setCurrentEpisode(Integer currentEpisode) { this.currentEpisode = currentEpisode; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
