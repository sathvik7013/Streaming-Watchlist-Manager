package com.watchlist.dto;

import com.watchlist.model.WatchlistItem;
import com.watchlist.model.enums.WatchStatus;
import java.time.LocalDateTime;

public class WatchlistItemResponse {
    private Long id;
    private Long contentId;
    private String contentTitle;
    private String contentType;
    private String genre;
    private String platform;
    private String posterUrl;
    private Integer totalEpisodes;
    private WatchStatus status;
    private Integer userRating;
    private Integer currentEpisode;
    private String notes;
    private LocalDateTime addedAt;
    private LocalDateTime updatedAt;

    public static WatchlistItemResponse fromEntity(WatchlistItem item) {
        WatchlistItemResponse resp = new WatchlistItemResponse();
        resp.setId(item.getId());
        resp.setContentId(item.getContent().getId());
        resp.setContentTitle(item.getContent().getTitle());
        resp.setContentType(item.getContent().getType().name());
        resp.setGenre(item.getContent().getGenre());
        resp.setPlatform(item.getContent().getPlatform());
        resp.setPosterUrl(item.getContent().getPosterUrl());
        resp.setTotalEpisodes(item.getContent().getTotalEpisodes());
        resp.setStatus(item.getStatus());
        resp.setUserRating(item.getUserRating());
        resp.setCurrentEpisode(item.getCurrentEpisode());
        resp.setNotes(item.getNotes());
        resp.setAddedAt(item.getAddedAt());
        resp.setUpdatedAt(item.getUpdatedAt());
        return resp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }

    public String getContentTitle() { return contentTitle; }
    public void setContentTitle(String contentTitle) { this.contentTitle = contentTitle; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public Integer getTotalEpisodes() { return totalEpisodes; }
    public void setTotalEpisodes(Integer totalEpisodes) { this.totalEpisodes = totalEpisodes; }

    public WatchStatus getStatus() { return status; }
    public void setStatus(WatchStatus status) { this.status = status; }

    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }

    public Integer getCurrentEpisode() { return currentEpisode; }
    public void setCurrentEpisode(Integer currentEpisode) { this.currentEpisode = currentEpisode; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
