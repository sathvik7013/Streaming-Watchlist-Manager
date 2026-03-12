package com.watchlist.model;

import com.watchlist.model.enums.ContentType;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "content")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType type;

    @Column(length = 100)
    private String genre;

    @Column(length = 100)
    private String platform;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "total_episodes")
    private Integer totalEpisodes;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL)
    private List<WatchlistItem> watchlistItems = new ArrayList<>();

    public Content() {}

    public Content(String title, String description, ContentType type, String genre,
                   String platform, Integer releaseYear, String posterUrl) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.genre = genre;
        this.platform = platform;
        this.releaseYear = releaseYear;
        this.posterUrl = posterUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ContentType getType() { return type; }
    public void setType(ContentType type) { this.type = type; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalEpisodes() { return totalEpisodes; }
    public void setTotalEpisodes(Integer totalEpisodes) { this.totalEpisodes = totalEpisodes; }

    public List<WatchlistItem> getWatchlistItems() { return watchlistItems; }
    public void setWatchlistItems(List<WatchlistItem> watchlistItems) { this.watchlistItems = watchlistItems; }
}
